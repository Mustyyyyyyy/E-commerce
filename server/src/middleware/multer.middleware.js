const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ok = /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype);
  if (!ok) return cb(new Error("Only image files are allowed (jpg, png, webp, gif)."));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 8, 
  },
});

/**
 * Upload many images from a field name (e.g. "images")
 * Example usage:
 *   router.post("/upload", auth, role("admin"), uploadMany("images"), ctrl.uploadImages)
 */
exports.uploadMany = (field = "images", maxCount = 8) => upload.array(field, maxCount);

/**
 * Upload single image
 * Example usage:
 *   router.post("/upload/single", auth, role("admin"), uploadSingle("image"), ctrl.uploadOne)
 */
exports.uploadSingle = (field = "image") => upload.single(field);

/**
 * Optional: multer error handler middleware
 * Put this in your global error handler OR use it just after routes that upload.
 */
exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "One of the files is too large (max 5MB)." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files (max 8)." });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message || "Upload error" });
  }

  next();
};