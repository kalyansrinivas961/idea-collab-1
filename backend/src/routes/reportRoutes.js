const express = require("express");
const router = express.Router();
const { createReport, getAllReports } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes - only logged in users can report content
router.post("/", protect, createReport);

// Moderator only route
router.get("/", protect, getAllReports);

module.exports = router;
