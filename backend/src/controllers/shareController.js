const SharedLink = require("../models/SharedLink");
const Idea = require("../models/Idea");
const User = require("../models/User");
const crypto = require("crypto");

/**
 * @desc    Create a shareable link for an idea
 * @route   POST /api/share/create
 * @access  Private
 */
exports.createSharedLink = async (req, res) => {
  const { ideaId, permissions, expiresIn, sharedWith } = req.body;

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if the user is the owner or a collaborator
    const isOwner = idea.owner.toString() === req.user._id.toString();
    const isCollaborator = idea.collaborators.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Not authorized to share this idea" });
    }

    let expiresAt = null;
    if (expiresIn) {
      // expiresIn is expected in hours
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
    }

    const shareToken = crypto.randomBytes(16).toString("hex");

    const sharedLink = await SharedLink.create({
      idea: ideaId,
      creator: req.user._id,
      permissions: permissions || "view",
      expiresAt,
      sharedWith: sharedWith || [],
      shareToken,
    });

    res.status(201).json(sharedLink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get idea by share token
 * @route   GET /api/share/:token
 * @access  Public
 */
exports.getIdeaByShareToken = async (req, res) => {
  try {
    const sharedLink = await SharedLink.findOne({ 
      shareToken: req.params.token,
      isActive: true 
    }).populate("idea");

    if (!sharedLink) {
      return res.status(404).json({ message: "Invalid or inactive share link" });
    }

    // Check expiration
    if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) {
      sharedLink.isActive = false;
      await sharedLink.save();
      return res.status(410).json({ message: "This share link has expired" });
    }

    // Track access
    sharedLink.accessCount += 1;
    sharedLink.lastAccessedAt = new Date();
    
    // Log access
    const accessEntry = {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      accessedAt: new Date(),
    };
    
    // If user is logged in, track them
    if (req.user) {
      accessEntry.user = req.user._id;
    }
    
    sharedLink.accessLog.push(accessEntry);
    await sharedLink.save();

    // Check if requester is a social bot for rich previews
    const userAgent = req.headers["user-agent"] || "";
    const isBot = /Twitterbot|facebookexternalhit|WhatsApp|TelegramBot|Slackbot/i.test(userAgent);

    if (isBot) {
      const idea = await Idea.findById(sharedLink.idea._id).populate("owner", "name");
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${idea.title} - IdeaCollab</title>
            <meta property="og:title" content="${idea.title}" />
            <meta property="og:description" content="${idea.description.substring(0, 160)}..." />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="${process.env.CLIENT_ORIGIN}/logo.png" />
            <meta property="og:site_name" content="IdeaCollab" />
            <meta name="twitter:card" content="summary_large_image" />
          </head>
          <body>
            <h1>${idea.title}</h1>
            <p>${idea.description}</p>
          </body>
        </html>
      `);
    }

    // Populate idea fully for regular users
    const idea = await Idea.findById(sharedLink.idea._id)
      .populate("owner", "name headline role avatarUrl status")
      .populate("collaborators", "name role avatarUrl status")
      .populate("comments.user", "name avatarUrl status");

    res.json({
      idea,
      permissions: sharedLink.permissions,
      expiresAt: sharedLink.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all shared links created by the user
 * @route   GET /api/share/history
 * @access  Private
 */
exports.getSharingHistory = async (req, res) => {
  try {
    const sharedLinks = await SharedLink.find({ creator: req.user._id })
      .populate("idea", "title visibility")
      .populate("sharedWith", "name avatarUrl")
      .sort({ createdAt: -1 });
    
    res.json(sharedLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Revoke a shared link
 * @route   DELETE /api/share/:id
 * @access  Private
 */
exports.revokeSharedLink = async (req, res) => {
  try {
    const sharedLink = await SharedLink.findById(req.params.id);
    
    if (!sharedLink) {
      return res.status(404).json({ message: "Share link not found" });
    }

    if (sharedLink.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to revoke this link" });
    }

    sharedLink.isActive = false;
    await sharedLink.save();

    res.json({ message: "Share link revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
