const router  = require("express").Router();
const ctrl    = require("../controllers/performanceController");
const { protect } = require("../middleware/auth");

router.post("/",           ctrl.trackPerformance);         // public
router.get( "/admin/all",  protect, ctrl.getPerformance);  // admin

module.exports = router;
