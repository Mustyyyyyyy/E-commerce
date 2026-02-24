const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../utils/validators");
const auth = require("../middleware/auth.middleware");

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);
router.get("/me", auth, ctrl.me);

router.post("/seed-admin", ctrl.seedAdmin);

module.exports = router;