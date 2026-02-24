const router = require("express").Router();
const ctrl = require("../controllers/product.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { productSchema } = require("../utils/validators");

// Public
router.get("/", ctrl.getProducts);
router.get("/slug/:slug", ctrl.getProductBySlug);

// Admin
router.get("/admin/all", auth, role("admin"), ctrl.adminGetProducts);
router.post("/", auth, role("admin"), validate(productSchema), ctrl.createProduct);
router.put("/:id", auth, role("admin"), ctrl.updateProduct);
router.delete("/:id", auth, role("admin"), ctrl.deleteProduct);

module.exports = router;