// import { Product } from "@/modules/Product.Module/domain/entities/Product.entity";
// import { IProductDocument } from "../models/Product.model";

// export class ProductMapper {
//   static mapToEntity(doc: IProductDocument): Product {
//     return new Product(
//       doc._id.toString(),
//       doc.name,
//       doc.description,
//       doc.categoryId,
//       doc.images, // updated
//       doc.basePrice,
//       doc.sellingPrice,
//       doc.variants.map(
//         (v) =>
//           new ProductVariant(v.name, v.basePrice, v.sellingPrice, v.isAvailable)
//       ),
//       doc.isAvailable,
//       doc.popularity,
//       doc.tags,
//       doc.ingredients.map(
//         (i) =>
//           new Ingredient(
//             i.name,
//             i.quantity,
//             i.isOptional,
//             i.additionalPrice,
//             i.allergens
//           )
//       ),
//       doc.nutritionInfo ? Object.fromEntries(doc.nutritionInfo) : {}, // convert Map to object
//       doc.createdAt,
//       doc.updatedAt
//     );
//   }

//   static toPersistence(entity: Product) {
//     return {
//       name: entity.name,
//       description: entity.description,
//       slug: entity.slug,
//       categoryId: entity.categoryId,
//       images: entity.images,
//       basePrice: entity.basePrice,
//       sellingPrice: entity.sellingPrice,
//       variants: entity.variants.map((v) => ({
//         name: v.name,
//         basePrice: v.basePrice,
//         sellingPrice: v.sellingPrice,
//         isAvailable: v.isAvailable,
//       })),
//       isAvailable: entity.isAvailable,
//       popularity: entity.popularity,
//       tags: entity.tags,
//       ingredients: entity.ingredients.map((i) => ({
//         name: i.name,
//         quantity: i.quantity,
//         isOptional: i.isOptional,
//         additionalPrice: i.additionalPrice,
//         allergens: i.allergens,
//       })),
//       nutritionInfo: entity.nutritionInfo, // Map or object is fine
//     };
//   }
// }
