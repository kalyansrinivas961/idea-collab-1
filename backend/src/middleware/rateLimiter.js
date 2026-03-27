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

module.exports = { passwordChangeLimiter, relationshipLimiter };
