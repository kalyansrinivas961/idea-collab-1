const Notification = require("../models/Notification");

// Helper function to create notification (can be used by other controllers)
exports.createNotification = async (req, { recipient, type, title, message, relatedId, relatedModel }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedId,
      relatedModel,
    });

    // Emit socket event
    if (req.io) {
      req.io.to(recipient.toString()).emit("notification:new", notification);
    }

    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Get notifications with filtering, sorting, and pagination
exports.getNotifications = async (req, res) => {
  try {
    const { type, startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const query = { recipient: req.user._id };

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search in title or message
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Chronological (newest first)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({
      notifications,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // Array of IDs, or empty for "mark all"

    const query = { recipient: req.user._id };
    if (ids && ids.length > 0) {
      query._id = { $in: ids };
    } else {
      query.isRead = false; // Only mark unread ones if marking all
    }

    await Notification.updateMany(query, { isRead: true });

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notifications
exports.deleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body; // Array of IDs

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No notifications selected" });
    }

    await Notification.deleteMany({
      recipient: req.user._id,
      _id: { $in: ids },
    });

    res.json({ message: "Notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
