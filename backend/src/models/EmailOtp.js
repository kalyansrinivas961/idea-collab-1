const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires in 10 minutes (600 seconds)
  },
});

module.exports = mongoose.model("EmailOtp", emailOtpSchema);
