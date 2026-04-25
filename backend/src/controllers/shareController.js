const SharedLink = require("../models/SharedLink");
const Idea = require("../models/Idea");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
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

    // Access control logic
    if (req.user) {
      // Authenticated: check if owner, collaborator, or if the idea is public
      const isOwner = idea.owner.toString() === req.user._id.toString();
      const isCollaborator = idea.collaborators.some(
        (id) => id.toString() === req.user._id.toString()
      );
      const isPublic = idea.visibility === "public";

      if (!isOwner && !isCollaborator && !isPublic) {
        return res.status(403).json({ message: "Not authorized to share this idea" });
      }
    } else {
      // Guest: can only share public ideas
      if (idea.visibility !== "public") {
        return res.status(401).json({ message: "Only public ideas can be shared without an account" });
      }
    }

    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
    }

    const shareToken = crypto.randomBytes(16).toString("hex");

    const sharedLink = await SharedLink.create({
      idea: ideaId,
      creator: req.user ? req.user._id : null,
      permissions: req.user ? (permissions || "view") : "view", // Guests always create view-only
      expiresAt,
      sharedWith: req.user ? (sharedWith || []) : [], // Guests cannot use internal sharing
      shareToken,
    });

    // If internal sharing, send messages to recipients
    if (req.user && sharedWith && sharedWith.length > 0) {
      const shareUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/share/${shareToken}`;
      const messageContent = `I shared an idea with you: "${idea.title}"`;

      for (const receiverId of sharedWith) {
        try {
          // Create message as an idea share
          const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content: messageContent,
            messageType: "idea_share",
            sharedIdea: {
              idea: ideaId,
              shareToken: shareToken
            }
          });

          // Find or create conversation
          let conversation = await Conversation.findOne({
            isGroup: false,
            members: { $all: [req.user._id, receiverId] }
          });

          if (!conversation) {
            conversation = await Conversation.create({
              isGroup: false,
              members: [req.user._id, receiverId],
              lastMessage: message._id
            });
          } else {
            conversation.lastMessage = message._id;
            await conversation.save();
          }

          // Notify receiver via socket
          if (req.io) {
            const populatedMessage = await Message.findById(message._id)
              .populate("sender", "name avatarUrl");
            req.io.to(receiverId.toString()).emit("chat:message", populatedMessage);
          }
        } catch (msgError) {
          console.error(`Failed to send share message to ${receiverId}:`, msgError);
          // Continue with other recipients even if one fails
        }
      }
    }

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

    // Enforce view-only for unauthenticated users
    const effectivePermissions = req.user ? sharedLink.permissions : "view";

    res.json({
      idea,
      permissions: effectivePermissions,
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
