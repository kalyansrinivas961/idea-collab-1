const rateLimit = require("express-rate-limit");

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 password change requests per windowMs
  message: {
    message: "Too many password change attempts, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const relationshipLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: {
    message: "Too many actions, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 OTP requests per 10 minutes
  message: {
    message: "Too many OTP requests. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const backupCodeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit to 5 attempts per IP per hour
  message: {
    message: "Too many backup code validation attempts. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { passwordChangeLimiter, relationshipLimiter, otpLimiter, backupCodeLimiter };
