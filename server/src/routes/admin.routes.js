const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const ctrl = require("../controllers/admin.controller");

router.get("/stats", auth, role("admin"), ctrl.stats);

module.exports = router;