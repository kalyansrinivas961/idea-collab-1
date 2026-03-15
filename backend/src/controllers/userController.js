const User = require("../models/User");
const { createNotification } = require("./notificationController");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        headline: user.headline,
        skills: user.skills,
        location: user.location,
        bio: user.bio,
        socialLinks: user.socialLinks,
        savedIdeas: user.savedIdeas || [],
        followers: user.followers || [],
        following: user.following || [],
      });
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
  try {
    const searchRegex = new RegExp(query, "i");
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { headline: searchRegex },
        { skills: { $in: [searchRegex] } }
      ]
    }).select("name avatarUrl headline role skills");
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, headline, role, skills, location, bio, socialLinks } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.headline = headline || user.headline;
      user.role = role || user.role;
      
      // Handle skills array if it comes as a string or array
      if (skills) {
          user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      user.location = location || user.location;
      user.bio = bio || user.bio;
      
      if (socialLinks) {
          // If socialLinks is a JSON string (from FormData), parse it
          let links = socialLinks;
          if (typeof socialLinks === 'string') {
              try {
                  links = JSON.parse(socialLinks);
              } catch (e) {
                  // Ignore parse error, maybe it's just a value? No, should be object.
                  console.error("Failed to parse socialLinks", e);
              }
          }
          user.socialLinks = { ...user.socialLinks, ...links };
      }

      if (req.file) {
        // Construct full URL. Assuming server runs on same host
        const baseUrl = process.env.VITE_API_URL || `${req.protocol}://${req.get("host")}`;
        user.avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        headline: updatedUser.headline,
        skills: updatedUser.skills,
        location: updatedUser.location,
        bio: updatedUser.bio,
        socialLinks: updatedUser.socialLinks,
        savedIdeas: updatedUser.savedIdeas,
        followers: updatedUser.followers || [],
        following: updatedUser.following || [],
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
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

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      // Create persistent notification
      await createNotification(req, {
        recipient: userToFollow._id,
        type: "info",
        title: "New Follower",
        message: `${currentUser.name} started following you`,
        relatedId: currentUser._id,
        relatedModel: "User",
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      following: currentUser.following,
      followersCount: userToFollow.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
