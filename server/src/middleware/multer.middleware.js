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
    fileSize: 5 * 1024 * 1024, // 5MB each
    files: 8, // max 8 files
  },
});

exports.uploadMany = (field = "images", maxCount = 8) => upload.array(field, maxCount);