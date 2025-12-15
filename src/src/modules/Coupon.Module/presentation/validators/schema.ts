import z from "zod";

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
