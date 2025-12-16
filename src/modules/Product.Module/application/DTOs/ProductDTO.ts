import { Types } from "mongoose";
import {
  ProductVariant,
  Ingredient,
  NutritionInfo,
  ProductMetadata,
} from "../../domain/entities/Product.entity";

export interface CreateProductDTO {
  name: string;
  slug?: string;
  description: string;
  categoryId: string;
  image: string;
  images?: string[];
  basePrice: number;
  sellingPrice: number;
  variants: CreateVariantDTO[];
  ingredients?: CreateIngredientDTO[];
  nutrition?: NutritionInfo;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  tags?: string[];
  metadata?: ProductMetadata;
}

export interface CreateVariantDTO {
  name: string;
  basePrice: number;
  sellingPrice: number;
  isAvailable?: boolean;
  sku?: string;
  stock?: number;
}

export interface CreateIngredientDTO {
  name: string;
  quantity?: string;
  isOptional: boolean;
  additionalPrice?: number;
  allergens?: string[];
}

export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  image?: string;
  images?: string[];
  basePrice?: number;
  sellingPrice?: number;
  variants?: ProductVariant[];
  ingredients?: Ingredient[];
  nutrition?: NutritionInfo;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  tags?: string[];
  metadata?: ProductMetadata;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: Types.ObjectId;
  categoryName?: string;
  categoryPath?: string[];
  image: string;
  images: string[];
  basePrice: number;
  sellingPrice: number;
  variants: ProductVariant[];
  ingredients: Ingredient[];
  nutrition: NutritionInfo | null;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  popularity: number;
  tags: string[];
  metadata: ProductMetadata;
  createdAt: Date;
  updatedAt: Date;
}
