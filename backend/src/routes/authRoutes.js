const express = require("express");
const { registerUser, loginUser, googleLogin, googleVerify, verifyEmail, sendOtp, verifyOtp, changePassword, forgotPassword, resetPasswordWithOtp, testEmail } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { passwordChangeLimiter } = require("../middleware/rateLimiter");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/verify", googleVerify);
router.post("/verify-email", verifyEmail);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordWithOtp);
router.put("/password", protect, passwordChangeLimiter, changePassword);
router.post("/test-email", protect, testEmail); // Added for diagnostics


module.exports = router;
