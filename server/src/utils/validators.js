const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  // role optional: only allow "customer" from public endpoint
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  category: z.enum(["electronics", "home-appliances", "fashion-beauty"]),
  images: z.array(z.string().url()).min(1),
  brand: z.string().optional(),
  featured: z.boolean().optional(),
  // variants optional
  variants: z
    .array(
      z.object({
        name: z.string().min(1), // e.g "Color: Black / Size: M"
        sku: z.string().min(1),
        stock: z.number().int().nonnegative(),
        price: z.number().nonnegative().optional()
      })
    )
    .optional(),
  stock: z.number().int().nonnegative().optional(), // used if no variants
});

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  active: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
  minSpend: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  couponSchema,
};