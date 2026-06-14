const router  = require("express").Router();
const ctrl    = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

router.post("/track", ctrl.trackView);          // public
router.get( "/",      protect, ctrl.getAnalytics); // admin

module.exports = router;
