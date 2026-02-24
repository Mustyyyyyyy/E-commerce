const router = require("express").Router();
const ctrl = require("../controllers/coupon.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { couponSchema } = require("../utils/validators");

// Public validate
router.post("/validate", ctrl.validateCoupon);

// Admin manage
router.post("/", auth, role("admin"), validate(couponSchema), ctrl.createCoupon);
router.get("/", auth, role("admin"), ctrl.listCoupons);
router.patch("/:id/toggle", auth, role("admin"), ctrl.toggleCoupon);

module.exports = router;