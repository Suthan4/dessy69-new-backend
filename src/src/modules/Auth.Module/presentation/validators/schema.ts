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


const customerDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  email: z.string().email().optional(),
  address: z.string().min(10).optional(),
});

