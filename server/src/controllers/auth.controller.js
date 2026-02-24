const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  // Public register always creates customer
  const user = await User.create({ name, email, password, role: "customer" });

  const token = signToken({ id: user._id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, role: user.role });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

/**
 * Create admin once (protect this in real life)
 * You can delete after you create your admin.
 */
exports.seedAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyAdmin = await User.findOne({ role: "admin" });
  if (alreadyAdmin) return res.status(400).json({ message: "Admin already exists" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const admin = await User.create({ name, email, password, role: "admin" });
  res.status(201).json({ id: admin._id, email: admin.email, role: admin.role });
});