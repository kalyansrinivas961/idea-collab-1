const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {
  const { receiverId, conversationId, content } = req.body;
  const file = req.file;

  if (!content && !file) {
    return res.status(400).json({ message: "Message content or attachment required" });
  }

  try {
    const messageData = {
      sender: req.user._id,
      content: content || "",
    };

    if (file) {
      const isImage = file.mimetype.startsWith("image/");
      const fileType = isImage ? "image" : "document";
      
      messageData.attachment = {
        url: `/uploads/${file.filename}`,
        fileType,
        originalName: file.originalname
      };
    }

    // Handle Group Message
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (!conversation.members.includes(req.user._id)) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }

      messageData.conversationId = conversationId;
      const message = await Message.create(messageData);
      const populatedMessage = await message.populate("sender", "name avatarUrl");

      // Update last message in conversation
      conversation.lastMessage = message._id;
      await conversation.save();

      // Emit to group room
      req.io.to(`group:${conversationId}`).emit("chat:message", populatedMessage);
      
      return res.status(201).json(populatedMessage);
    }

    // Handle 1-on-1 Message
    if (receiverId) {
      messageData.receiver = receiverId;
      const message = await Message.create(messageData);
      const populatedMessage = await message.populate("sender", "name avatarUrl");

      // Emit to receiver's room
      req.io.to(receiverId).emit("chat:message", populatedMessage);
      
      return res.status(201).json(populatedMessage);
    }

    return res.status(400).json({ message: "Receiver or Group ID required" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !members || members.length === 0) {
    return res.status(400).json({ message: "Group name and members are required" });
  }

  try {
    // Add creator to members if not already included
    const memberIds = [...new Set([...members, req.user._id.toString()])];

    const group = await Conversation.create({
      name,
      isGroup: true,
      admin: req.user._id,
      members: memberIds,
    });

    const populatedGroup = await group.populate("members", "name avatarUrl");
    
    // Notify members (optional, can be done via socket)
    memberIds.forEach(memberId => {
      if (memberId !== req.user._id.toString()) {
        req.io.to(memberId).emit("group:created", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    // 1. Get 1-on-1 Conversations (Users)
    const sent = await Message.find({ sender: req.user._id, conversationId: { $exists: false } }).distinct("receiver");
    const received = await Message.find({ receiver: req.user._id, conversationId: { $exists: false } }).distinct("sender");
    
    const userIds = [...new Set([...sent.map(id => id.toString()), ...received.map(id => id.toString())])];
    const users = await User.find({ _id: { $in: userIds } }).select("name avatarUrl headline role");
    
    const userConversations = users.map(user => ({
      _id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      headline: user.headline,
      type: 'user'
    }));

    // 2. Get Group Conversations
    const groups = await Conversation.find({ members: req.user._id })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const groupConversations = groups.map(group => ({
      _id: group._id,
      name: group.name,
      avatarUrl: group.avatarUrl, // Placeholder or actual
      isGroup: true,
      type: 'group',
      lastMessage: group.lastMessage
    }));

    // Combine and return
    res.json([...groupConversations, ...userConversations]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({
      conversationId: groupId,
      deletedBy: { $ne: req.user._id },
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatarUrl");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
      deletedBy: { $ne: req.user._id },
      conversationId: { $exists: false } // Ensure only 1-on-1 messages
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatarUrl");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... keep existing delete/clear/read methods ...
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { type } = req.query; // 'me' or 'everyone'
  
  try {
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = message.sender.toString() === req.user._id.toString();

    // If type is 'everyone' and user is sender, delete for everyone
    if (type === 'everyone') {
      if (!isSender) {
        return res.status(403).json({ message: "You can only delete your own messages for everyone" });
      }
      await Message.deleteOne({ _id: messageId });
      
      if (message.conversationId) {
        req.io.to(`group:${message.conversationId}`).emit("chat:message_deleted", { messageId });
      } else {
        req.io.emit("chat:message_deleted", { messageId }); // Broad implementation, could be optimized
      }
      
      return res.json({ message: "Message unsent" });
    }
    
    // Default or type='me': Delete for me
    await Message.updateOne(
      { _id: messageId },
      { $addToSet: { deletedBy: req.user._id } }
    );
    return res.json({ message: "Message deleted for you" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearChat = async (req, res) => {
  const { partnerId, groupId } = req.body;
  
  try {
    if (groupId) {
      // Clear group chat for user
      await Message.updateMany(
        { conversationId: groupId },
        { $addToSet: { deletedBy: req.user._id } }
      );
    } else {
      // Clear 1-on-1 chat
      await Message.updateMany(
        {
          $or: [
            { sender: req.user._id, receiver: partnerId },
            { sender: partnerId, receiver: req.user._id },
          ],
          conversationId: { $exists: false }
        },
        {
          $addToSet: { deletedBy: req.user._id }
        }
      );
    }
    
    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    // Count unread 1-on-1 messages
    const oneOnOneCount = await Message.countDocuments({
      receiver: req.user._id,
      read: false,
    });
    
    // Count unread group messages
    // This is trickier without a "readBy" array in messages or a separate UserConversation state.
    // For now, let's stick to 1-on-1 unread count or implement basic group unread if feasible.
    // Given the constraints, I'll stick to 1-on-1 count for the badge to ensure stability.
    
    res.json({ count: oneOnOneCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { senderId, groupId } = req.body;
  try {
    if (groupId) {
      // Mark group messages as read? 
      // Current schema only has boolean `read`. This works for 1-on-1 but not groups (one person reading shouldn't mark for all).
      // For groups, we need `readBy: [UserId]`.
      // I'll skip group read receipts for this iteration to keep it simple, or just not support it yet.
      return res.json({ message: "Group read receipts not fully supported yet" });
    }

    const result = await Message.updateMany(
      {
        sender: senderId,
        receiver: req.user._id,
        read: false,
      },
      { $set: { read: true } }
    );

    if (result.modifiedCount > 0) {
      req.io.to(senderId).emit("chat:read", {
        readerId: req.user._id,
      });
    }

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
