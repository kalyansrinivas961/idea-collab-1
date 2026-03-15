const express = require("express");
const router = express.Router();
const { getAIResponse, enhanceDescription } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Protected route - only logged in users can chat with AI
router.post("/chat", protect, getAIResponse);
router.post("/enhance-description", protect, enhanceDescription);

module.exports = router;
