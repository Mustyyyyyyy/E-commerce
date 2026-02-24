const asyncHandler = require("../utils/asyncHandler");
const { cloudinary, cloudinaryEnabled } = require("../config/cloudinary");

/**
 * This expects `req.files` from multer memory storage.
 * If Cloudinary envs are not set, it will reject (so you don’t silently use same placeholders).
 */
exports.uploadImages = asyncHandler(async (req, res) => {
  if (!cloudinaryEnabled) {
    return res.status(400).json({
      message:
        "Cloudinary not configured. Add CLOUDINARY_* env variables to enable uploads.",
    });
  }

  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  const uploads = [];
  for (const f of files) {
    const b64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(b64, {
      folder: "brandstore/products",
    });
    uploads.push(result.secure_url);
  }

  res.status(201).json({ urls: uploads });
});