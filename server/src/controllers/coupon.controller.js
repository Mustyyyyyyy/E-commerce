const Coupon = require("../models/Coupon");
const asyncHandler = require("../utils/asyncHandler");

exports.createCoupon = asyncHandler(async (req, res) => {
  const exists = await Coupon.findOne({ code: req.body.code });
  if (exists) return res.status(400).json({ message: "Coupon code exists" });
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

exports.listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

exports.toggleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  coupon.active = !coupon.active;
  await coupon.save();
  res.json(coupon);
});

exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase() });
  if (!coupon || !coupon.active) return res.status(400).json({ message: "Invalid coupon" });

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: "Coupon expired" });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ message: "Coupon usage limit reached" });
  }

  const sub = Number(subtotal || 0);
  if (coupon.minSpend && sub < coupon.minSpend) {
    return res.status(400).json({ message: `Minimum spend is ${coupon.minSpend}` });
  }

  let discount = 0;
  if (coupon.type === "percent") discount = (coupon.value / 100) * sub;
  if (coupon.type === "fixed") discount = coupon.value;

  // avoid discount > subtotal
  discount = Math.min(discount, sub);

  res.json({ valid: true, code: coupon.code, discount });
});