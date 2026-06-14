// src/routes/brand.js
const express                  = require("express");
const router                   = express.Router();
const {
  getBrand,
  updateBrand,
  uploadLogo,
  uploadAvatar,
}                              = require("../controllers/brandController");
const { protect, restrictTo }  = require("../middleware/auth");
const { uploadBrand, uploadAvatar: uploadAvatarMiddleware } = require("../config/cloudinary");

// Public
router.get("/", getBrand);

// Admin — update text fields (JSON body, no file)
router.put("/", protect, restrictTo("admin"), updateBrand);

// Admin — upload logo image
router.post(
  "/logo",
  protect, restrictTo("admin"),
  uploadBrand.single("logo"),
  uploadLogo
);

// Admin — upload avatar image
router.post(
  "/avatar",
  protect, restrictTo("admin"),
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar
);

module.exports = router;