const express = require("express");
const { registerUser, loginUser, googleLogin, googleVerify, verifyEmail, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { passwordChangeLimiter } = require("../middleware/rateLimiter");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/verify", googleVerify);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/password", protect, passwordChangeLimiter, changePassword);


module.exports = router;
