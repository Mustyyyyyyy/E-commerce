const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Color: Black / Size: M"
    sku: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true },
    category: {
      type: String,
      enum: ["electronics", "home-appliances", "fashion-beauty"],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true },
    featured: { type: Boolean, default: false },
    stock: { type: Number, min: 0, default: 0 },
    variants: { type: [variantSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);