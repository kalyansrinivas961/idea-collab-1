const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  deleteNotifications,
  getUnreadCount,
} = require("../controllers/notificationController");

router.use(protect); // All routes require authentication

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read", markAsRead);
router.post("/delete", deleteNotifications); // Using POST for delete with body

module.exports = router;
