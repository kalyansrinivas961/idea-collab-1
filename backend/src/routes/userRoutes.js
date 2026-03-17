const express = require("express");
const { getMe, updateProfile, getSavedIdeas, toggleSaveIdea, getUserById, followUser, getFollowers, getFollowing, searchUsers, getFollowRequests, updateFollowRequestStatus, unfollowUserExplicit, removeFollower, getActivityLog, getUserStats } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { relationshipLimiter } = require("../middleware/rateLimiter");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Images only!"));
    }
  },
});

router.get("/me", protect, getMe);
router.get("/stats", protect, getUserStats);
router.get("/stats/:userId", protect, getUserStats);
router.get("/activity", protect, getActivityLog);
router.get("/activity/:userId", protect, getActivityLog);
router.put("/me", protect, upload.single("avatar"), updateProfile);
router.get("/saved-ideas", protect, getSavedIdeas);
router.put("/saved-ideas/:id", protect, toggleSaveIdea);
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserById);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.put("/:id/follow", protect, relationshipLimiter, followUser);
router.delete("/:id/unfollow", protect, relationshipLimiter, unfollowUserExplicit);
router.delete("/:id/follower", protect, relationshipLimiter, removeFollower);

// Follow request management
router.get("/follow-requests/pending", protect, getFollowRequests);
router.put("/follow-requests/:requestId", protect, relationshipLimiter, updateFollowRequestStatus);

module.exports = router;
