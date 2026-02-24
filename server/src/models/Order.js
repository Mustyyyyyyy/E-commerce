const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    variantSku: { type: String } // optional
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    couponCode: { type: String },

    shippingAddress: {
      fullName: String,
      phone: String,
      address1: String,
      city: String,
      state: String,
      country: String,
      notes: String,
    },

    payment: {
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      provider: { type: String, default: "manual" }, // later: paystack/stripe
      reference: { type: String }
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      index: true
    },

    tracking: {
      courier: String,
      trackingNumber: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);