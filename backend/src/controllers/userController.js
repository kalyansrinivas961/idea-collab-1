const User = require("../models/User");
const FollowRequest = require("../models/FollowRequest");
const ActivityLog = require("../models/ActivityLog");
const { createNotification } = require("./notificationController");
const { formatUserResponse } = require("../utils/userUtils");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(formatUserResponse(user));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "name avatarUrl headline role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "name avatarUrl headline role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const logs = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("targetUser", "name avatarUrl");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    // Count user's ideas
    const Idea = require("../models/Idea");
    const ideasCount = await Idea.countDocuments({ owner: userId });
    
    // Count total likes on user's ideas
    const ideas = await Idea.find({ owner: userId }, "likes");
    const totalLikes = ideas.reduce((sum, idea) => sum + (idea.likes?.length || 0), 0);
    
    // Count collaborations
    const collaborationsCount = await Idea.countDocuments({ collaborators: userId });

    res.json({
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      ideasCount,
      totalLikes,
      collaborationsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSaveIdea = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ideaId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize savedIdeas if it doesn't exist
    if (!user.savedIdeas) {
      user.savedIdeas = [];
    }

    const index = user.savedIdeas.indexOf(ideaId);

    if (index === -1) {
      // Add to saved
      user.savedIdeas.push(ideaId);
    } else {
      // Remove from saved
      user.savedIdeas.splice(index, 1);
    }

    await user.save();
    res.json(user.savedIdeas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedIdeas = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedIdeas",
      populate: { path: "owner", select: "name avatarUrl" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedIdeas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  const query = req.query.query || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const searchRegex = new RegExp(query, "i");
    const searchQuery = {
      status: "Active",
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { headline: searchRegex },
        { skills: { $in: [searchRegex] } }
      ]
    };

    const users = await User.find(searchQuery)
      .select("name avatarUrl headline role skills email")
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(searchQuery);
    
    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, headline, role, skills, location, bio, socialLinks, privacySettings } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.headline = headline !== undefined ? headline : user.headline;
      user.role = role || user.role;
      
      // Handle skills array if it comes as a string or array
      if (skills !== undefined) {
          user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      user.location = location !== undefined ? location : user.location;
      user.bio = bio !== undefined ? bio : user.bio;
      
      if (socialLinks) {
          let links = socialLinks;
          if (typeof socialLinks === 'string') {
              try {
                  links = JSON.parse(socialLinks);
              } catch (e) {
                  console.error("Failed to parse socialLinks", e);
              }
          }
          user.socialLinks = { ...user.socialLinks, ...links };
      }

      if (privacySettings) {
        let privacy = privacySettings;
        if (typeof privacySettings === 'string') {
          try {
            privacy = JSON.parse(privacySettings);
          } catch (e) {
            console.error("Failed to parse privacySettings", e);
          }
        }
        user.privacySettings = { ...user.privacySettings, ...privacy };
      }

      if (req.file) {
        const baseUrl = process.env.VITE_API_URL || `${req.protocol}://${req.get("host")}`;
        user.avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();

      // Log update activity
      await ActivityLog.create({
        user: user._id,
        action: "update_profile"
      });

      res.json(formatUserResponse(updatedUser));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Role-based access control (example: only Active users can view profiles)
    // You can extend this based on requirements
    if (user.status === "Suspended" && req.user.role !== "Admin") {
      return res.status(403).json({ message: "This account has been suspended." });
    }

    // Check privacy settings
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing = req.user && user.followers.some(id => id.toString() === req.user._id.toString());
    const isConnection = isFollowing; // Simplify for now

    const visibility = user.privacySettings?.profileVisibility || "public";

    if (!isOwner && visibility === "private") {
      return res.status(403).json({ message: "This profile is private." });
    }

    if (!isOwner && visibility === "connections" && !isConnection) {
      return res.status(403).json({ message: "This profile is only visible to connections." });
    }

    // Prepare response object
    const userObj = user.toObject();

    // Check if there is a pending follow request from current user
    let isRequested = false;
    if (req.user) {
      const FollowRequest = require("../models/FollowRequest");
      const request = await FollowRequest.findOne({
        sender: req.user._id,
        receiver: user._id,
        status: "pending"
      });
      isRequested = !!request;
    }
    userObj.isRequested = isRequested;

    // Apply granular privacy filters
    if (!isOwner) {
      if (!user.privacySettings?.showEmail) {
        delete userObj.email;
      }
      if (!user.privacySettings?.showLocation) {
        delete userObj.location;
      }
    }

    // Role-based information for admins
    if (req.user && req.user.role === 'admin') {
      const Report = require("../models/Report");
      const reportsAgainstUser = await Report.countDocuments({
        idea: { $in: await require("../models/Idea").find({ owner: user._id }, "_id") }
      });
      userObj.moderationInfo = {
        reportsCount: reportsAgainstUser,
        isSuspended: user.status === 'Suspended'
      };
    }

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Initialize arrays if undefined
    if (!currentUser.following) currentUser.following = [];
    if (!userToFollow.followers) userToFollow.followers = [];

    const isFollowing = currentUser.following.some(id => id.toString() === userToFollow._id.toString());

    if (isFollowing) {
      // Unfollow - immediate
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      
      await currentUser.save();
      await userToFollow.save();

      return res.json({
        status: "unfollowed",
        following: currentUser.following,
        followersCount: userToFollow.followers.length
      });
    } else {
      // Check for existing pending request
      const existingRequest = await FollowRequest.findOne({
        sender: currentUser._id,
        receiver: userToFollow._id,
        status: "pending"
      });

      if (existingRequest) {
        // Cancel request if they click again while pending
        await existingRequest.deleteOne();
        return res.json({
          status: "request_cancelled",
          message: "Follow request cancelled"
        });
      }

      // Create private follow request
      const followRequest = await FollowRequest.create({
        sender: currentUser._id,
        receiver: userToFollow._id,
        status: "pending"
      });

      // Log activity
      await ActivityLog.create({
        user: currentUser._id,
        action: "request_follow",
        targetUser: userToFollow._id
      });

      // Create persistent notification for receiver
      await createNotification(req, {
        recipient: userToFollow._id,
        type: "info",
        title: "New Follow Request",
        message: `${currentUser.name} wants to follow you`,
        relatedId: followRequest._id,
        relatedModel: "FollowRequest",
      });

      // Emit socket event for real-time update
      if (req.io) {
        req.io.to(userToFollow._id.toString()).emit("follow:request", {
          requestId: followRequest._id,
          sender: {
            _id: currentUser._id,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl
          }
        });
      }

      return res.json({
        status: "requested",
        message: "Follow request sent"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowRequests = async (req, res) => {
  try {
    const requests = await FollowRequest.find({
      receiver: req.user._id,
      status: "pending"
    }).populate("sender", "name avatarUrl headline role");
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFollowRequestStatus = async (req, res) => {
  const { status } = req.body; // "accepted" or "rejected"
  const { requestId } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await FollowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Follow request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const sender = await User.findById(request.sender);
      const receiver = await User.findById(request.receiver);

      if (sender && receiver) {
        if (!sender.following.some(id => id.toString() === receiver._id.toString())) {
          sender.following.push(receiver._id);
          await sender.save();
        }
        if (!receiver.followers.some(id => id.toString() === sender._id.toString())) {
          receiver.followers.push(sender._id);
          await receiver.save();
        }

        // Log activity
        await ActivityLog.create({
          user: req.user._id,
          action: "accept_follow",
          targetUser: sender._id
        });

        // Notify sender that request was accepted
        await createNotification(req, {
          recipient: sender._id,
          type: "success",
          title: "Follow Request Accepted",
          message: `${receiver.name} accepted your follow request`,
          relatedId: receiver._id,
          relatedModel: "User",
        });
      }
    } else {
      // Log rejection
      await ActivityLog.create({
        user: req.user._id,
        action: "reject_follow",
        targetUser: request.sender
      });
    }

    res.json({ message: `Request ${status} successfully`, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowUserExplicit = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: "unfollow",
      targetUser: userToUnfollow._id
    });

    res.json({ message: "Unfollowed successfully", following: currentUser.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFollower = async (req, res) => {
  try {
    const followerToRemove = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!followerToRemove) return res.status(404).json({ message: "User not found" });

    // Remove current user from their following
    followerToRemove.following = followerToRemove.following.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    // Remove them from current user's followers
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== followerToRemove._id.toString()
    );

    await currentUser.save();
    await followerToRemove.save();

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: "remove_follower",
      targetUser: followerToRemove._id
    });

    res.json({ message: "Follower removed successfully", followers: currentUser.followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
