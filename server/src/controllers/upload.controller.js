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

async function uploadWithRetry(buffer, options, tries = 2) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const result = await Promise.race([
        uploadBuffer(buffer, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Cloudinary timeout")), 25000)),
      ]);
      return result;
    } catch (e) {
      if (attempt === tries) throw e;
    }
  }
}

exports.uploadImages = asyncHandler(async (req, res) => {
  if (!cloudinaryEnabled) {
    return res.status(400).json({ message: "Cloudinary not configured." });
  }

  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  try {
    const urls = [];
    for (const f of files) {
      const r = await uploadWithRetry(f.buffer, { folder: "brandstore/products" }, 2);
      urls.push(r.secure_url);
    }
    return res.status(201).json({ urls });
  } catch (e) {
    console.error("UPLOAD FAIL:", e);
    return res.status(500).json({ message: "Upload failed. Check server logs." });
  }
});