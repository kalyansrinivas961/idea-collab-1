const Idea = require("../models/Idea");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const jwt = require("jsonwebtoken");

const getUserFromToken = async (req) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.id).select("-password");
    } catch (error) {
      return null;
    }
  }
  return null;
};

exports.createIdea = async (req, res) => {
  const { title, description, category, tags, visibility, allowedCommenters } = req.body;
  const files = req.files;

  try {
    const attachments = files ? files.map(file => {
      const isImage = file.mimetype.startsWith("image/");
      return {
        url: `/uploads/${file.filename}`,
        fileType: isImage ? "image" : "document",
        originalName: file.originalname
      };
    }) : [];

    // Parse tags if it comes as string (multipart/form-data sends array as individual fields or stringified)
    // When using FormData, arrays often need manual parsing if sent as comma-separated string
    let parsedTags = tags;
    if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const idea = new Idea({
      title,
      description,
      category,
      tags: parsedTags,
      visibility: visibility || 'public',
      allowedCommenters: allowedCommenters || 'anyone',
      owner: req.user._id,
      attachments
    });

    const createdIdea = await idea.save();
    
    // Populate owner for the socket event
    await createdIdea.populate("owner", "name headline role avatarUrl");
    
    // Emit real-time event
    req.io.emit("idea:created", createdIdea);
    
    res.status(201).json(createdIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    // Check comment permissions
    const isOwner = idea.owner.toString() === req.user._id.toString();
    
    if (!isOwner) {
      if (idea.allowedCommenters === 'none') {
        return res.status(403).json({ message: "Comments are disabled for this idea" });
      }
      if (idea.allowedCommenters === 'connections') {
        // Check if current user follows the idea owner
        // user.following is array of ObjectIds. 
        // We need to compare string values or use .equals()
        const isFollowing = req.user.following.some(id => id.toString() === idea.owner.toString());
        
        if (!isFollowing) {
           return res.status(403).json({ message: "Only connections can comment on this idea" });
        }
      }
    }

    const comment = {
      user: req.user._id,
      text,
    };

    idea.comments.push(comment);
    await idea.save();

    // Notify owner if commenter is not owner
    if (idea.owner.toString() !== req.user._id.toString()) {
      await createNotification(req, {
        recipient: idea.owner,
        type: "info",
        title: "New Comment",
        message: `${req.user.name} commented on "${idea.title}"`,
        relatedId: idea._id,
        relatedModel: "Idea",
      });
    }

    await idea.populate("comments.user", "name avatarUrl");
    
    // Emit updated idea
    // Note: We might want to emit just the comment, but idea:updated covers it
    const updatedIdea = await Idea.findById(idea._id)
       .populate("owner", "name headline role avatarUrl")
       .populate("collaborators", "name role avatarUrl")
       .populate("comments.user", "name avatarUrl");

    req.io.emit("idea:updated", updatedIdea);

    res.status(201).json(idea.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    const comment = idea.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() !== req.user._id.toString() &&
      idea.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    idea.comments.pull(req.params.commentId);
    await idea.save();

    const updatedIdea = await Idea.findById(idea._id)
       .populate("owner", "name headline role avatarUrl")
       .populate("collaborators", "name role avatarUrl")
       .populate("comments.user", "name avatarUrl");

    req.io.emit("idea:updated", updatedIdea);

    res.json(idea.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeas = async (req, res) => {
  const { search, category } = req.query;

  try {
    const user = await getUserFromToken(req);
    let query = {};

    if (user) {
      // Logged in: show public OR (connections AND following owner) OR own ideas
      query.$or = [
        { visibility: "public" },
        { 
          visibility: "connections", 
          owner: { $in: user.following } 
        },
        { owner: user._id }
      ];
    } else {
      // Not logged in: show only public
      query = { visibility: "public" };
    }

    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ]
      };
      
      if (query.$or) {
        // If we already have an $or for visibility, we need to AND it with the search
        query = {
          $and: [
            query, // The visibility logic
            searchCondition
          ]
        };
      } else {
        // If query was just { visibility: "public" }
        query = { ...query, ...searchCondition };
      }
    }

    if (category) {
      // If query became complex with $and, we add category to that
      if (query.$and) {
        query.$and.push({ category: { $regex: category, $options: "i" } });
      } else {
        query.category = { $regex: category, $options: "i" };
      }
    }

    const ideas = await Idea.find(query)
      .populate("owner", "name headline role avatarUrl")
      .populate("collaborators", "name role avatarUrl")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const query = { owner: req.params.userId };
    const isOwner = req.user._id.toString() === req.params.userId;
    
    if (!isOwner) {
      const isFollowing = req.user.following.includes(req.params.userId);
      
      if (isFollowing) {
        // Show public and connections
        query.visibility = { $in: ["public", "connections"] };
      } else {
        // Show only public
        query.visibility = "public";
      }
    }

    const ideas = await Idea.find(query)
      .populate("owner", "name headline role avatarUrl")
      .populate("collaborators", "name role avatarUrl")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("owner", "name headline role avatarUrl")
      .populate("collaborators", "name role avatarUrl")
      .populate("comments.user", "name avatarUrl");

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const user = await getUserFromToken(req);
    let canView = false;
    let canComment = false;

    if (idea.visibility === 'public') {
      canView = true;
    } else if (user) {
      const isOwner = idea.owner._id.toString() === user._id.toString();
      if (isOwner) {
        canView = true;
      } else if (idea.visibility === 'connections') {
        // Check if user follows owner
        if (user.following.includes(idea.owner._id)) {
          canView = true;
        }
      }
    }

    if (!canView) {
      return res.status(403).json({ message: "You do not have permission to view this idea" });
    }

    // Determine if user can comment
    if (user) {
        const isOwner = idea.owner._id.toString() === user._id.toString();
        if (isOwner) {
            canComment = true;
        } else {
            if (idea.allowedCommenters === 'anyone') {
                canComment = true;
            } else if (idea.allowedCommenters === 'connections') {
                if (user.following.includes(idea.owner._id)) {
                    canComment = true;
                }
            }
        }
    }

    const ideaObj = idea.toObject();
    ideaObj.canComment = canComment;

    res.json(ideaObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIdea = async (req, res) => {
  const { title, description, category, tags, visibility, allowedCommenters } = req.body;

  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check ownership
    if (idea.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this idea" });
    }

    idea.title = title || idea.title;
    idea.description = description || idea.description;
    idea.category = category || idea.category;
    idea.tags = tags || idea.tags;
    if (visibility) idea.visibility = visibility;
    if (allowedCommenters) idea.allowedCommenters = allowedCommenters;

    const updatedIdea = await idea.save();

    await updatedIdea.populate("owner", "name headline role avatarUrl");
    await updatedIdea.populate("collaborators", "name role avatarUrl");

    req.io.emit("idea:updated", updatedIdea);

    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check ownership
    if (idea.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this idea" });
    }

    await idea.deleteOne();
    
    req.io.emit("idea:deleted", req.params.id);

    res.json({ message: "Idea removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if already liked
    const userIdStr = req.user._id.toString();
    const index = idea.likes.findIndex((id) => id.toString() === userIdStr);
    const alreadyLiked = index !== -1;
    
    if (!alreadyLiked) {
      // Like
      idea.likes.push(req.user._id);
    } else {
      // Unlike
      idea.likes.splice(index, 1);
    }

    const updated = await idea.save();
    
    // Populate for consistent event payload
    await updated.populate("owner", "name headline role avatarUrl");
    await updated.populate("collaborators", "name role avatarUrl");

    // Send notification to owner if liked by someone else and it's a new like
    if (!alreadyLiked && idea.owner._id.toString() !== req.user._id.toString()) {
      await createNotification(req, {
        recipient: idea.owner._id,
        type: "info",
        title: "New Like",
        message: `${req.user.name} liked your idea "${idea.title}"`,
        relatedId: idea._id,
        relatedModel: "Idea",
      });
    }

    // Emit real-time update
    if (req.io) {
      req.io.emit("idea:updated", updated);
    }

    res.json(updated.likes);
  } catch (err) {
    next(err);
  }
};
