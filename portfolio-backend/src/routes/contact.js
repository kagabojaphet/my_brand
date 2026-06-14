const router  = require("express").Router();
const ctrl    = require("../controllers/contactController");
const { protect } = require("../middleware/auth");

// Public
router.post("/", ctrl.sendMessage);

// Admin
router.get(   "/admin/all",       protect, ctrl.getMessages);
router.patch( "/admin/:id/status",protect, ctrl.updateStatus);
router.delete("/admin/:id",       protect, ctrl.deleteMessage);

module.exports = router;
