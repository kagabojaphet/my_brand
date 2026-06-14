const router  = require("express").Router();
const ctrl    = require("../controllers/visitorController");
const { protect } = require("../middleware/auth");

router.post("/",                       ctrl.trackVisitor);       // public
router.patch("/:sessionId/duration",   ctrl.updateDuration);    // public
router.get(  "/admin/all",   protect,  ctrl.getVisitors);        // admin

module.exports = router;
