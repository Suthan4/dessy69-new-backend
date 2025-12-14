import { Types } from "mongoose";
import { z } from "zod";

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Category Schemas
export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid parent category ID")
    .optional(),
});

// Product Schemas
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  isAvailable: z.boolean().optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  image: z.string().url(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  isAvailable: z.boolean().optional(),
  popularity: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

// Order Schemas
const objectIdSchema = z.string().transform((val) => {
  try {
    return new Types.ObjectId(val);
  } catch {
    throw new Error("Invalid ObjectId");
  }
});

const orderItemSchema = z.object({
  menuItemId: objectIdSchema,
  name: z.string(),
  variantName: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  totalPrice: z.number().positive(),
});

const customerDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  email: z.string().email().optional(),
  address: z.string().min(10).optional(),
});

export const OrderSchema = z.object({
  customerDetails: customerDetailsSchema,
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const VerifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

// Coupon Schemas
export const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
});
