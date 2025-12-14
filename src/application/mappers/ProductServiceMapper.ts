import { Product } from "@/domain/entities/Product.entity";
import { ProductResponseDTO } from "../dtos/ProductDTO";

export class ProductServiceMapper {
  static mapToDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      image: product.image,
      variants: product.variants,
      isAvailable: product.isAvailable,
      popularity: product.popularity,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
