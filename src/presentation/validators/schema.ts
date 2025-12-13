import { Types } from "mongoose";
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  category: z.string(),
  basePrice: z.number().positive(),
  image: z.string().url(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        additionalPrice: z.number(),
        isAvailable: z.boolean().default(true),
      })
    )
    .default([]),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

const objectIdSchema = z.string().transform((val) => new Types.ObjectId(val));

export const OrderSchema = z.object({
  items: z.array(
    z.object({
      productId: objectIdSchema,
      productName: z.string(),
      quantity: z.number().positive(),
      basePrice: z.number(),
      variant: z
        .object({
          name: z.string(),
          additionalPrice: z.number(),
          isAvailable: z.boolean(),
        })
        .nullable(),
      totalPrice: z.number(),
    })
  ),
  subtotal: z.number(),
  paymentId: z.string(),
  couponCode: z.string()
});


export const CouponSchema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxDiscount: z.number().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().optional(),
});
