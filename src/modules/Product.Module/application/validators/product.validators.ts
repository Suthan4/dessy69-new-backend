import { z } from "zod";

const ProductVariantSchema = z.object({
  name: z.string().min(2, "Variant name must be at least 2 characters"),
  size: z.string().min(1, "Size is required"),
  basePrice: z.number().positive("Base price must be positive"),
  sellingPrice: z.number().positive("Selling price must be positive"),
  isAvailable: z.boolean().default(true),
});
const IngredientSchema = z.object({
  name: z.string().min(2, "Variant name must be at least 2 characters"),
  quantity: z.string().optional(),
  isOptional: z.boolean(),
  additionalPrice: z.number().optional(),
  allergens: z.array(z.string()).optional(),
});
const NutritionSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});

export const CreateProductSchema = z
  .object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .max(200),
    slug: z
      .string()
      .min(2)
      .max(200)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must be lowercase alphanumeric with hyphens"
      ),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
    basePrice: z.number().positive("Base price must be positive"),
    sellingPrice: z.number().positive("Selling price must be positive"),
    variants: z.array(ProductVariantSchema).default([]),
    images: z.array(z.string().url()).default([]),
    ingredients: z.array(IngredientSchema).default([]),
    nutritionInfo: z.record(z.string(), NutritionSchema).optional(),
  })
  .refine((data) => data.sellingPrice <= data.basePrice, {
    message: "Selling price cannot be greater than base price",
    path: ["sellingPrice"],
  });

export const UpdateProductSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  basePrice: z.number().positive().optional(),
  sellingPrice: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  variants: z.array(ProductVariantSchema).optional(),
  images: z.array(z.string().url()).optional(),
  ingredients: z.array(IngredientSchema).optional(),
  nutritionInfo: z.record(z.string(),NutritionSchema).optional(),
});

export const UpdateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const ProductQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
  isAvailable: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
});

export const ProductIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
