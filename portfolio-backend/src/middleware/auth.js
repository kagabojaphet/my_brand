// src/middleware/auth.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/** Verify Bearer token and attach user to req */
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Not authorised — no token." });

    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, message: "User no longer exists." });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

/** Role-based guard — use as:  restrictTo("admin") */
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ success: false, message: "You do not have permission." });
  next();
};

/** Convenience alias — same as restrictTo("admin") */
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success: false, message: "Admin access required." });
  next();
};