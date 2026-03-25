const express = require("express");
const {
  createProblem,
  getProblems,
  getProblemById,
  voteProblem,
  createSolution,
  getSolutions,
  voteSolution,
  acceptSolution,
} = require("../controllers/qaController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Problems
router.route("/problems")
  .get(getProblems)
  .post(protect, createProblem);

router.route("/problems/:id")
  .get(getProblemById);

router.post("/problems/:id/vote", protect, voteProblem);

// Solutions
router.route("/problems/:problemId/solutions")
  .get(getSolutions)
  .post(protect, createSolution);

router.post("/solutions/:id/vote", protect, voteSolution);
router.post("/solutions/:id/accept", protect, acceptSolution);

module.exports = router;
