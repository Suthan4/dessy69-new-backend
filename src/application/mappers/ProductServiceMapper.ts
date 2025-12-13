import { Product } from "@/domain/entities/Product.entity";
import { ProductResponseDTO } from "../dtos/ProductDTO";

export class ProductServiceMapper {
  static mapToDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice,
      image: product.image,
      variants: product.variants,
      isAvailable: product.isAvailable,
      isPopular: product.isPopular,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
