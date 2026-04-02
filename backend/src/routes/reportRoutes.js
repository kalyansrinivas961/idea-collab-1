const express = require("express");
const router = express.Router();
const { createReport, getAllReports, updateReportStatus, getReportById } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes - only logged in users can report content
router.post("/", protect, createReport);

// Moderator only routes
router.get("/", protect, getAllReports);
router.get("/:id", protect, getReportById);
router.put("/:id/status", protect, updateReportStatus);

module.exports = router;
