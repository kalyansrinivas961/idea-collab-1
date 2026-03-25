const Problem = require("../models/Problem");
const Solution = require("../models/Solution");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { createNotification } = require("./notificationController");

// Reputation constants
const REPUTATION_UPVOTE_PROBLEM = 2;
const REPUTATION_UPVOTE_SOLUTION = 5;
const REPUTATION_ACCEPT_SOLUTION = 15;

/**
 * Helper to log activity
 */
const logActivity = async (userId, action, metadata = {}) => {
  try {
    await ActivityLog.create({ user: userId, action, metadata });
  } catch (error) {
    console.error("Activity Logging Error:", error);
  }
};

/**
 * Update user reputation
 */
const updateReputation = async (userId, amount) => {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { reputation: amount } });
  } catch (error) {
    console.error("Reputation Update Error:", error);
  }
};

/**
 * Create a new problem
 */
exports.createProblem = async (req, res) => {
  const { title, description, tags, category, codeSnippets } = req.body;

  try {
    const problem = await Problem.create({
      title,
      description,
      tags,
      category,
      codeSnippets,
      author: req.user._id,
    });

    await logActivity(req.user._id, "create_problem", { problemId: problem._id });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a problem (Soft-delete with cascade and audit logging)
 */
exports.deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Deletion Rights: Only author can delete
    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this problem" });
    }

    // Soft-delete problem
    problem.isDeleted = true;
    problem.deletedAt = new Date();
    await problem.save();

    // Cascade deletion of solutions (soft-delete)
    await Solution.updateMany(
      { problemId: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    // Audit logging
    await logActivity(req.user._id, "delete_problem", { 
      problemId: id,
      deletedAt: problem.deletedAt,
      title: problem.title
    });

    res.json({ message: "Problem and associated solutions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all problems with search and filters
 */
exports.getProblems = async (req, res) => {
  const { search, tags, category, status, sort } = req.query;
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (tags) {
    query.tags = { $in: tags.split(",") };
  }
  if (category) {
    query.category = category;
  }
  if (status) {
    query.status = status;
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "votes") {
    sortQuery = { upvotes: -1 };
  } else if (sort === "views") {
    sortQuery = { views: -1 };
  }

  try {
    const problems = await Problem.find(query)
      .populate("author", "name avatarUrl reputation")
      .sort(sortQuery);
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get problem by ID
 */
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("author", "name avatarUrl reputation")
      .populate("acceptedSolution");
    
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Increment views
    problem.views += 1;
    await problem.save();

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vote on a problem
 */
exports.voteProblem = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'upvote' or 'downvote'

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const userId = req.user._id;
    const hasUpvoted = problem.upvotes.includes(userId);
    const hasDownvoted = problem.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        problem.upvotes.pull(userId);
        await updateReputation(problem.author, -REPUTATION_UPVOTE_PROBLEM);
      } else {
        problem.upvotes.push(userId);
        if (hasDownvoted) problem.downvotes.pull(userId);
        await updateReputation(problem.author, REPUTATION_UPVOTE_PROBLEM);
      }
    } else {
      if (hasDownvoted) {
        problem.downvotes.pull(userId);
      } else {
        problem.downvotes.push(userId);
        if (hasUpvoted) {
          problem.upvotes.pull(userId);
          await updateReputation(problem.author, -REPUTATION_UPVOTE_PROBLEM);
        }
      }
    }

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit a solution
 */
exports.createSolution = async (req, res) => {
  const { problemId, content, codeSnippets, parentReply } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Self-Reply Restriction: Prevent author from replying to their own question
    // This applies only if it's a top-level reply (parentReply is null)
    if (!parentReply && problem.author.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot reply to your own question. Use the edit feature for updates." });
    }

    // Permission check for nested replies:
    // User can reply to others' reactions (solutions) even on their own question.
    if (parentReply) {
      const parentSolution = await Solution.findById(parentReply);
      if (!parentSolution) return res.status(404).json({ message: "Parent reply not found" });
      
      // Prevent replying to own solutions/replies
      if (parentSolution.author.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: "You cannot reply to your own response." });
      }
    }

    const solution = await Solution.create({
      problemId,
      content,
      codeSnippets,
      parentReply,
      author: req.user._id,
    });

    await logActivity(req.user._id, "create_solution", { 
      problemId, 
      solutionId: solution._id,
      isNested: !!parentReply 
    });

    // Create notification for problem author (if not the one replying)
    if (problem.author.toString() !== req.user._id.toString()) {
      await createNotification(req, {
        recipient: problem.author,
        type: "info",
        title: "New Solution",
        message: `${req.user.name} submitted a solution to your problem: ${problem.title}`,
        relatedId: problem._id,
        relatedModel: "Problem",
      });
    }

    // If it's a reply to someone's solution, notify the solution author
    if (parentReply) {
      const parentSolution = await Solution.findById(parentReply);
      if (parentSolution && parentSolution.author.toString() !== req.user._id.toString()) {
        await createNotification(req, {
          recipient: parentSolution.author,
          type: "info",
          title: "New Reply",
          message: `${req.user.name} replied to your solution`,
          relatedId: problem._id,
          relatedModel: "Problem",
        });
      }
    }

    res.status(201).json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get solutions for a problem
 */
exports.getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ problemId: req.params.problemId })
      .populate("author", "name avatarUrl reputation")
      .sort({ upvotes: -1, createdAt: 1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vote on a solution
 */
exports.voteSolution = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const solution = await Solution.findById(id);
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    const userId = req.user._id;
    const hasUpvoted = solution.upvotes.includes(userId);
    const hasDownvoted = solution.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        solution.upvotes.pull(userId);
        await updateReputation(solution.author, -REPUTATION_UPVOTE_SOLUTION);
      } else {
        solution.upvotes.push(userId);
        if (hasDownvoted) solution.downvotes.pull(userId);
        await updateReputation(solution.author, REPUTATION_UPVOTE_SOLUTION);
      }
    } else {
      if (hasDownvoted) {
        solution.downvotes.pull(userId);
      } else {
        solution.downvotes.push(userId);
        if (hasUpvoted) {
          solution.upvotes.pull(userId);
          await updateReputation(solution.author, -REPUTATION_UPVOTE_SOLUTION);
        }
      }
    }

    await solution.save();
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept a solution
 */
exports.acceptSolution = async (req, res) => {
  const { id } = req.params;

  try {
    const solution = await Solution.findById(id).populate("problemId");
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    const problem = solution.problemId;
    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the problem author can accept a solution" });
    }

    // Toggle acceptance
    if (solution.isAccepted) {
      solution.isAccepted = false;
      problem.isResolved = false;
      problem.acceptedSolution = undefined;
      await updateReputation(solution.author, -REPUTATION_ACCEPT_SOLUTION);
    } else {
      // Un-accept previous solution if any
      if (problem.acceptedSolution) {
        const prevSolution = await Solution.findById(problem.acceptedSolution);
        if (prevSolution) {
          prevSolution.isAccepted = false;
          await prevSolution.save();
          await updateReputation(prevSolution.author, -REPUTATION_ACCEPT_SOLUTION);
        }
      }

      solution.isAccepted = true;
      problem.isResolved = true;
      problem.acceptedSolution = solution._id;
      await updateReputation(solution.author, REPUTATION_ACCEPT_SOLUTION);

      // Notify solution author
      await createNotification(
        solution.author,
        "Solution Accepted!",
        `Your solution was accepted for: ${problem.title}`,
        "success",
        "Problem",
        problem._id
      );
    }

    await solution.save();
    await problem.save();

    res.json({ problem, solution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
