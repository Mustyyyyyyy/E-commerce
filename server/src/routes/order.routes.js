const router = require("express").Router();
const ctrl = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Admin (keep above "/:id")
router.get("/admin/all/list", auth, role("admin"), ctrl.adminListOrders);
router.patch("/admin/:id/status", auth, role("admin"), ctrl.adminUpdateOrderStatus);

// Customer
router.post("/", auth, role("customer", "admin"), ctrl.createOrder);
router.get("/mine", auth, role("customer", "admin"), ctrl.myOrders);
router.get("/:id", auth, role("customer", "admin"), ctrl.getOrderById);

module.exports = router;