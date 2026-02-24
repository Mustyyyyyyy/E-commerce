const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, unique: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    minSpend: { type: Number, default: 0, min: 0 },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);