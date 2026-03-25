const Problem = require("../models/Problem");
const Solution = require("../models/Solution");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// Reputation constants
const REPUTATION_UPVOTE_PROBLEM = 2;
const REPUTATION_UPVOTE_SOLUTION = 5;
const REPUTATION_ACCEPT_SOLUTION = 15;

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

    res.status(201).json(problem);
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

    const solution = await Solution.create({
      problemId,
      content,
      codeSnippets,
      parentReply,
      author: req.user._id,
    });

    // Create notification for problem author
    if (problem.author.toString() !== req.user._id.toString()) {
      await createNotification(
        problem.author,
        "New Solution",
        `${req.user.name} submitted a solution to your problem: ${problem.title}`,
        "info",
        "Problem",
        problem._id
      );
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
