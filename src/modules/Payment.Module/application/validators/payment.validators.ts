import { z } from "zod";

export const CreatePaymentOrderSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay signature is required"),
});

export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
