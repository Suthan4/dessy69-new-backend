import { ProductVariant } from "@/domain/entities/Product.entity";
import { Types } from "mongoose";

export interface CreateProductDTO {
  name: string;
  description: string;
  categoryId: string;
  image: string;
  variants: ProductVariant[];
  isAvailable?: boolean;
  popularity?: number;
  tags?: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  categoryId?: string;
  image?: string;
  variants?: ProductVariant[];
  isAvailable?: boolean;
  popularity?: number;
  tags?: string[];
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  categoryId: Types.ObjectId;
  categoryName?: string;
  image: string;
  variants: ProductVariant[];
  isAvailable: boolean;
  popularity: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
