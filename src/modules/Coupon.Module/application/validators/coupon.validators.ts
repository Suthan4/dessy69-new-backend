import { z } from "zod";

export const CreateCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(50)
      .toUpperCase(),
    type: z.enum(["percentage", "fixed"], {
      message: "Type must be percentage or fixed",
    }),
    value: z.number().positive("Value must be positive"),
    minOrderAmount: z
      .number()
      .min(0, "Min order amount cannot be negative")
      .default(0),
    maxDiscount: z.number().positive("Max discount must be positive"),
    usageLimit: z
      .number()
      .int()
      .positive("Usage limit must be a positive integer"),
    startDate: z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => new Date(val)),
    applicableCategories: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
      .default([]),
    applicableProducts: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
      .default([]),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.value <= 100;
      }
      return true;
    },
    {
      message: "Percentage value cannot exceed 100",
      path: ["value"],
    }
  );

export const UpdateCouponSchema = z.object({
  value: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  endDate: z
    .string()
    .datetime()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
});

export const ValidateCouponSchema = z.object({
  code: z.string().min(3),
  orderAmount: z.number().positive("Order amount must be positive"),
  productIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
  categoryIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
});

export const CouponIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid coupon ID"),
});

export const CouponQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
});

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;
