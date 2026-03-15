const express = require("express");
const { getMe, updateProfile, getSavedIdeas, toggleSaveIdea, getUserById, followUser, getFollowers, getFollowing, searchUsers } = require("../controllers/userController");
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
router.put("/me", protect, upload.single("avatar"), updateProfile);
router.get("/saved-ideas", protect, getSavedIdeas);
router.put("/saved-ideas/:id", protect, toggleSaveIdea);
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserById);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.put("/:id/follow", protect, followUser);

module.exports = router;
