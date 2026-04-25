const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  console.log(`[AUTH] Checking auth for route: ${req.originalUrl}`);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      console.log(`[AUTH] Authenticated user: ${req.user._id} with role: ${req.user.role}`);
      return next();
      
    } catch (error) {
      console.error(`[AUTH] Token verification failed:`, error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.warn(`[AUTH] No token found in headers for route: ${req.originalUrl}`);
    res.status(401).json({ message: "Not authorized, no token" });
  }
};



const optionalProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Don't block, just don't set req.user
    }
  }
  next();
};

module.exports = { protect, optionalProtect };
