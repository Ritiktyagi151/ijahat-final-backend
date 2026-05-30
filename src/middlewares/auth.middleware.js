const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the header has a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the database (excluding password) and attach to req.user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found with this token" });
      }

      next(); // Move to the next function (the controller)
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

exports.adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found with this token" });
      }

      return next();
    } catch (error) {
      console.error("Admin Auth Middleware Error:", error);
      return res.status(401).json({ message: "Admin token failed" });
    }
  }

  return res.status(401).json({ message: "Admin token required" });
};
