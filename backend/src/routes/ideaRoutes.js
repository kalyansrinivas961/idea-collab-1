const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  toggleLike,
  addComment,
  deleteComment,
  getIdeasByUser,
} = require("../controllers/ideaController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `idea-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx|txt|ppt|pptx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Allowed file types: Images, PDF, DOC, DOCX, TXT, PPT"));
    }
  },
});

router.route("/").get(getIdeas).post(protect, upload.array("attachments", 5), createIdea);
router.route("/user/:userId").get(protect, getIdeasByUser);
router.route("/:id")
  .get(getIdeaById)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.route("/:id/like").put(protect, toggleLike);
router.route("/:id/comments").post(protect, addComment);
router.route("/:id/comments/:commentId").delete(protect, deleteComment);

module.exports = router;
