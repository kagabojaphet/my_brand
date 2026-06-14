// src/routes/projects.js
const express                  = require("express");
const router                   = express.Router();
const {
  getProjects,
  getProject,
  adminGetProjects,
  createProject,
  updateProject,
  deleteProject,
}                              = require("../controllers/projectController");
const { protect, restrictTo }  = require("../middleware/auth");
const { uploadProject }        = require("../config/cloudinary");

// ── Admin routes FIRST (before /:id to avoid capture conflicts) ───────────
router.get(
  "/admin/all",
  protect, restrictTo("admin"),
  adminGetProjects
);

router.post(
  "/admin/create",
  protect, restrictTo("admin"),
  uploadProject.single("coverImage"),
  createProject
);

router.put(
  "/admin/:id",
  protect, restrictTo("admin"),
  uploadProject.single("coverImage"),
  updateProject
);

router.delete(
  "/admin/:id",
  protect, restrictTo("admin"),
  deleteProject
);

// ── Public ────────────────────────────────────────────────────────────────
router.get("/",    getProjects);
router.get("/:id", getProject);

module.exports = router;