import z from "zod";

const OrderItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  variantId: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  deliveryAddress: z
    .string()
    .min(10, "Delivery address must be at least 10 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  couponCode: z.string().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  note: z.string().max(500).optional(),
});

export const OrderQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
  status: z
    .enum([
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ])
    .optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
});

export const OrderIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
