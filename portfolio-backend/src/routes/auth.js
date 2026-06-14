const express    = require("express");
const router     = express.Router();
const auth       = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadAvatar } = require("../config/cloudinary");

router.post("/register", auth.register);                                          // POST /api/auth/register
router.post("/login",    auth.login);                                             // POST /api/auth/login
router.post("/logout",   protect, auth.logout);                                   // POST /api/auth/logout
router.get ("/me",       protect, auth.getMe);                                    // GET  /api/auth/me
router.put ("/profile",  protect, auth.updateProfile);                            // PUT  /api/auth/profile  (name/email)
router.post("/avatar",   protect, uploadAvatar.single("avatar"), auth.uploadAvatar); // POST /api/auth/avatar   (image upload)
router.put ("/password", protect, auth.changePassword);                           // PUT  /api/auth/password

module.exports = router;
