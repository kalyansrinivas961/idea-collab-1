const express = require("express");
const {
  createRequest,
  getRequestsForMe,
  getRequestsByMe,
  updateRequestStatus,
  getAllRequests,
  getPendingRequestCount,
} = require("../controllers/collaborationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/requests", protect, createRequest);
router.get("/requests", protect, getAllRequests); // Combined endpoint for frontend
router.get("/requests/pending-count", protect, getPendingRequestCount);
router.get("/requests/received", protect, getRequestsForMe);
router.get("/requests/sent", protect, getRequestsByMe);
router.put("/requests/:id", protect, updateRequestStatus);

module.exports = router;
