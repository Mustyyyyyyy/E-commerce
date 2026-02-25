const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { uploadMany } = require("../middleware/multer.middleware");
const ctrl = require("../controllers/upload.controller");

router.post("/", auth, role("admin"), uploadMany("images", 8), ctrl.uploadImages);

module.exports = router;