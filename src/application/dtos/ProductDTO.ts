import { ProductVariant } from "@/domain/entities/Product.entity";

export interface CreateProductDTO {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  variants?: ProductVariant[];
  isAvailable?: boolean;
  isPopular?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category?: string;
  basePrice?: number;
  image?: string;
  variants?: ProductVariant[];
  isAvailable?: boolean;
  isPopular?: boolean;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  variants: ProductVariant[];
  isAvailable: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}
