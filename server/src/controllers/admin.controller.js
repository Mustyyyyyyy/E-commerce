const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const User = require("../models/User");

exports.stats = asyncHandler(async (req, res) => {
  const [orders, products, customers] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { "payment.status": "paid" } },
    { $group: { _id: null, revenue: { $sum: "$total" } } },
  ]);

  const revenue = revenueAgg?.[0]?.revenue || 0;

  const lowStock = await Product.find({
    $or: [{ stock: { $lte: 5 } }, { "variants.stock": { $lte: 5 } }],
  }).select("name category stock variants images");

  res.json({ orders, products, customers, revenue, lowStock });
});