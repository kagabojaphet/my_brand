// src/routes/education.js
const express                  = require("express");
const router                   = express.Router();
const {
  getEducation,
  adminGetEducation,
  createEducation,
  updateEducation,
  deleteEducation,
}                              = require("../controllers/educationController");
const { protect, restrictTo }  = require("../middleware/auth");
const { uploadGeneral }        = require("../config/cloudinary");

// ── Admin routes FIRST (before public /:id) ───────────────────────────────
router.get(
  "/admin/all",
  protect, restrictTo("admin"),
  adminGetEducation
);

router.post(
  "/admin/create",
  protect, restrictTo("admin"),
  uploadGeneral.single("logo"),
  createEducation
);

router.put(
  "/admin/:id",
  protect, restrictTo("admin"),
  uploadGeneral.single("logo"),
  updateEducation
);

router.delete(
  "/admin/:id",
  protect, restrictTo("admin"),
  deleteEducation
);

// ── Public ────────────────────────────────────────────────────────────────
router.get("/", getEducation);

module.exports = router;