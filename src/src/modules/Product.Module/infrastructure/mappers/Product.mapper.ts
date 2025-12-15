import { Product, ProductVariant } from "@/modules/Product.Module/domain/entities/Product.entity";
import { IProductDocument } from "../models/Product.model";

export class ProductMapper {
  static mapToEntity(doc: IProductDocument): Product {
    return new Product(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.categoryId,
      doc.image,
      doc.basePrice,
      doc.sellingPrice,
      doc.variants.map(
        (v) => new ProductVariant(v.name, v.basePrice,v.sellingPrice, v.isAvailable)
      ),
      doc.isAvailable,
      doc.popularity,
      doc.tags,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPersistence(entity: Product) {
    return {
      name: entity.name,
      description: entity.description,
      categoryId: entity.categoryId,
      image: entity.image,
      basePrice: entity.basePrice,
      sellingPrice: entity.sellingPrice,
      variants: entity.variants.map((v) => ({
        name: v.name,
        basePrice: v.basePrice,
        sellingPrice: v.sellingPrice,
        isAvailable: v.isAvailable,
      })),
      isAvailable: entity.isAvailable,
      popularity: entity.popularity,
      tags: entity.tags,
    };
  }
}
