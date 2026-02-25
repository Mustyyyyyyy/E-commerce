const asyncHandler = require("../utils/asyncHandler");
const { cloudinary, cloudinaryEnabled } = require("../config/cloudinary");

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

exports.uploadImages = asyncHandler(async (req, res) => {
  if (!cloudinaryEnabled) {
    return res.status(400).json({
      message: "Cloudinary not configured. Add CLOUDINARY_* env variables to enable uploads.",
    });
  }

  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  const TIMEOUT_MS = 25000;

  const urls = [];
  for (const f of files) {
    const result = await Promise.race([
      uploadBuffer(f.buffer, { folder: "brandstore/products" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Cloudinary upload timed out")), TIMEOUT_MS)
      ),
    ]);

    urls.push(result.secure_url);
  }

  return res.status(201).json({ urls });
});