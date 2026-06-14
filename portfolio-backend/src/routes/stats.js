const router  = require("express").Router();
const ctrl    = require("../controllers/statsController");
const { protect } = require("../middleware/auth");

router.get("/dashboard", protect, ctrl.getDashboardStats);

module.exports = router;
