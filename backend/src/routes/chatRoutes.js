const express = require("express");
const { sendMessage, getMessages, getConversations, getUnreadCount, markMessagesAsRead, deleteMessage, clearChat, createGroup, getGroupMessages } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `chat-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Allowed file types: Images, PDF, DOC, DOCX, TXT"));
    }
  },
});

router.post("/", protect, upload.single("attachment"), sendMessage);
router.post("/group", protect, createGroup);
router.post("/clear", protect, clearChat);
router.get("/conversations", protect, getConversations);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read", protect, markMessagesAsRead);
router.delete("/:messageId", protect, deleteMessage);
router.get("/group/:groupId", protect, getGroupMessages);
router.get("/:userId", protect, getMessages);

module.exports = router;
