import { z } from "zod";


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
