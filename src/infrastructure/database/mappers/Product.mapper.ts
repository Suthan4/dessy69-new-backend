import { Product, ProductVariant } from "@/domain/entities/Product.entity";
import { IProductDocument } from "../models/Product.model";

export class ProductMapper {
  static mapToEntity(doc: IProductDocument): Product {
    return new Product(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.category,
      doc.basePrice,
      doc.image,
      doc.variants.map(
        (v) => new ProductVariant(v.name, v.additionalPrice, v.isAvailable)
      ),
      doc.isAvailable,
      doc.isPopular,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
