const express = require("express");
const { registerUser, loginUser, googleLogin, googleVerify, verifyEmail, sendOtp, verifyOtp, changePassword, forgotPassword, resetPasswordWithOtp } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { passwordChangeLimiter, otpLimiter } = require("../middleware/rateLimiter");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/verify", googleVerify);
router.post("/verify-email", verifyEmail);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", resetPasswordWithOtp);
router.put("/password", protect, passwordChangeLimiter, changePassword);


module.exports = router;
