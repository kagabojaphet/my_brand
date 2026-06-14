const jwt            = require("jsonwebtoken");
const User           = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

// ── Token helper ───────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const cookieOpts = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── POST /api/auth/register  (first-time admin setup only) ────────────────
exports.register = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists)
      return res.status(400).json({
        success: false,
        message: "Admin account already exists. Use the login endpoint.",
      });

    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password are required." });

    const user  = await User.create({ name, email, password, role: "admin" });
    const token = signToken(user._id);

    res.cookie("token", token, cookieOpts);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });

    // password has select:false in schema — must explicitly include it
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.cookie("token", token, cookieOpts);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ──────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie("token", cookieOpts);
  res.json({ success: true, message: "Logged out successfully." });
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, lastLogin: user.lastLogin },
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/profile ──────────────────────────────────────────────────
// Updates name and/or email (no file upload here)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const update = {};
    if (name  !== undefined) update.name  = name.trim();
    if (email !== undefined) update.email = email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new:           true,
      runValidators: true,
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      message: "Profile updated.",
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/avatar ──────────────────────────────────────────────────
// Expects: multipart/form-data, field name = "avatar"
// multer (uploadAvatar middleware) handles the Cloudinary upload before this runs.
// req.file.path     = Cloudinary secure_url
// req.file.filename = Cloudinary public_id
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No image file provided." });

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    // Delete old avatar from Cloudinary (fire-and-forget — don't fail on error)
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (_) {}
    }

    user.avatar         = req.file.path;      // Cloudinary secure_url
    user.avatarPublicId = req.file.filename;  // Cloudinary public_id
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      avatar:  user.avatar,
      message: "Avatar updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/password ─────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "Current and new passwords are required." });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ success: false, message: "New password must be at least 6 characters." });

    const user = await User.findById(req.user.id).select("+password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    const token = signToken(user._id);
    res.cookie("token", token, cookieOpts);

    res.json({ success: true, token, message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
};
