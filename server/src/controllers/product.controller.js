const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");

exports.createProduct = asyncHandler(async (req, res) => {
  const data = req.body;

  let slug = slugify(data.name);
  // ensure unique slug
  let i = 1;
  while (await Product.findOne({ slug })) {
    slug = `${slugify(data.name)}-${i++}`;
  }

  // If variants exist, stock is derived or left 0
  const product = await Product.create({
    ...data,
    slug,
    stock: data.variants?.length ? 0 : (data.stock ?? 0),
  });

  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // if name changes, update slug safely
  if (data.name && data.name !== product.name) {
    let slug = slugify(data.name);
    let i = 1;
    while (await Product.findOne({ slug, _id: { $ne: id } })) {
      slug = `${slugify(data.name)}-${i++}`;
    }
    product.slug = slug;
  }

  Object.assign(product, data);

  // stock handling
  if (product.variants?.length) {
    product.stock = 0; // we use variant stock
  } else if (typeof data.stock === "number") {
    product.stock = data.stock;
  }

  await product.save();
  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Deleted" });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    featured,
    minPrice,
    maxPrice,
    inStock,
    page = 1,
    limit = 12
  } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { brand: { $regex: q, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (inStock === "true") {
    // inStock if either base stock > 0 OR any variant has stock > 0
    filter.$or = [
      ...(filter.$or || []),
      { stock: { $gt: 0 } },
      { "variants.stock": { $gt: 0 } }
    ];
  }

  const p = Number(page);
  const l = Number(limit);

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    page: p,
    limit: l,
    total,
    totalPages: Math.ceil(total / l),
  });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug, isActive: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Admin can view all (including inactive)
exports.adminGetProducts = asyncHandler(async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});