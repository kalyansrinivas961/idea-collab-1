const express = require("express");
const {
  createSharedLink,
  getIdeaByShareToken,
  getSharingHistory,
  revokeSharedLink,
} = require("../controllers/shareController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter for link creation
const shareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 share requests per window
  message: {
    message: "Too many sharing requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/create", optionalProtect, shareLimiter, createSharedLink);
router.get("/history", protect, getSharingHistory);
router.get("/:token", optionalProtect, getIdeaByShareToken);
router.delete("/:id", protect, revokeSharedLink);

module.exports = router;
