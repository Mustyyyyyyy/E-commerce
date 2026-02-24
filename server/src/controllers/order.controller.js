const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

function computeTotals({ items, shippingFee = 0, discount = 0 }) {
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const total = Math.max(0, subtotal - discount + shippingFee);
  return { subtotal, total };
}

function validateCoupon(coupon, subtotal) {
  if (!coupon || !coupon.active) return { ok: false, message: "Invalid coupon" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now())
    return { ok: false, message: "Coupon expired" };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return { ok: false, message: "Coupon usage limit reached" };
  if (coupon.minSpend && subtotal < coupon.minSpend)
    return { ok: false, message: `Minimum spend is ${coupon.minSpend}` };
  return { ok: true };
}

async function buildItemsFromDB(rawItems, session) {
  const built = [];

  for (const it of rawItems) {
    const qty = Number(it?.quantity || 0);
    if (!it?.productId || !Number.isFinite(qty) || qty < 1) {
      throw Object.assign(new Error("Invalid items payload"), { statusCode: 400 });
    }

    const product = await Product.findById(it.productId).session(session);
    if (!product || product.isActive === false) {
      throw Object.assign(new Error("Product not found"), { statusCode: 400 });
    }

    let unitPrice = product.price;
    let variantSku;

    if (it.variantSku) {
      variantSku = String(it.variantSku);
      const v = product.variants?.find((x) => x.sku === variantSku);
      if (!v) throw Object.assign(new Error("Variant not found"), { statusCode: 400 });

      if (typeof v.price === "number") unitPrice = v.price;
    }

    built.push({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      quantity: qty,
      unitPrice,
      variantSku,
    });
  }

  return built;
}

/**
 * Atomic stock deduction (prevents overselling)
 */
async function deductStockAtomic(items, session) {
  for (const it of items) {
    if (it.variantSku) {
      const result = await Product.updateOne(
        {
          _id: it.productId,
          "variants.sku": it.variantSku,
          "variants.stock": { $gte: it.quantity },
        },
        { $inc: { "variants.$.stock": -it.quantity } },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw Object.assign(
          new Error(`Not enough stock for variant ${it.variantSku}`),
          { statusCode: 400 }
        );
      }
    } else {
      const result = await Product.updateOne(
        { _id: it.productId, stock: { $gte: it.quantity } },
        { $inc: { stock: -it.quantity } },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw Object.assign(new Error("Not enough stock"), { statusCode: 400 });
      }
    }
  }
}

exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const rawItems = req.body.items;
  const shippingAddress = req.body.shippingAddress || {};
  const couponCode = req.body.couponCode;
  const shippingFee = Math.max(0, Number(req.body.shippingFee || 0));

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return res.status(400).json({ message: "No items" });
  }

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      // 1) Build trusted items from DB
      const items = await buildItemsFromDB(rawItems, session);

      // 2) Subtotal needed for coupon
      const subtotalTmp = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

      // 3) Coupon validation + discount
      let discount = 0;
      let normalizedCoupon;

      if (couponCode) {
        normalizedCoupon = String(couponCode).toUpperCase();
        const coupon = await Coupon.findOne({ code: normalizedCoupon }).session(session);

        const verdict = validateCoupon(coupon, subtotalTmp);
        if (!verdict.ok) {
          throw Object.assign(new Error(verdict.message), { statusCode: 400 });
        }

        discount =
          coupon.type === "percent" ? (coupon.value / 100) * subtotalTmp : coupon.value;
        discount = Math.min(discount, subtotalTmp);
      }

      const { subtotal, total } = computeTotals({ items, shippingFee, discount });

      // 4) Deduct stock atomically
      await deductStockAtomic(items, session);

      // 5) Create order (use new Order + save to avoid "array" confusion)
      const order = new Order({
        userId,
        items,
        shippingAddress,
        couponCode: normalizedCoupon,
        subtotal,
        discount,
        shippingFee,
        total,
        payment: { status: "pending", provider: "manual" },
        status: "pending",
      });

      await order.save({ session });
      createdOrder = order;

      // 6) Increase coupon usage only after order save succeeds
      if (normalizedCoupon) {
        await Coupon.updateOne(
          { code: normalizedCoupon },
          { $inc: { usedCount: 1 } },
          { session }
        );
      }
    });

    res.status(201).json(createdOrder);
  } finally {
    session.endSession();
  }
});

exports.myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "customer" && String(order.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(order);
});

// ADMIN
exports.adminListOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("userId", "name email");

  res.json(orders);
});

exports.adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, tracking, paymentStatus } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (status) order.status = status;
  if (paymentStatus) order.payment.status = paymentStatus;
  if (tracking) order.tracking = { ...order.tracking, ...tracking };

  await order.save();
  res.json(order);
});