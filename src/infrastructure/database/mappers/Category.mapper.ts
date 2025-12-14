// import { Category } from "@/domain/entities/Category.entity";
// import { ICategoryDocument } from "../models/Category.model";

// export class CategoryMapper {
//   static mapToEntity(doc: ICategoryDocument): Category {
//     return new Category(
//       doc._id.toString(),
//       doc.name,
//       doc.description,
//       doc.image,
//       doc.isActive,
//       doc.path,
//       doc.parentId ? doc.parentId.toString() : null,
//       doc.level,
//       doc.createdAt,
//       doc.updatedAt
//     );
//   }

//   static toPersistence(entity: Category) {
//     const data: any = {
//       name: entity.name,
//       isActive: entity.isActive,
//       path: entity.path,
//       parentId: entity.parentId || null,
//       level: entity.level,
//     };

//     if (entity.description) data.description = entity.description;
//     if (entity.image) data.image = entity.image;

//     return data;
//   }
// }
import { Category } from "@/domain/entities/Category.entity";
import { ICategoryDocument } from "../models/Category.model";

export class CategoryMapper {
  static mapToEntity(doc: ICategoryDocument): Category {
    return new Category(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.image,
      doc.isActive,
      doc.parentId ? doc.parentId.toString() : null,
      doc.level,
      doc.path,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPersistence(entity: Category) {
    const data: any = {
      name: entity.name,
      isActive: entity.isActive,
      level: entity.level,
      path: entity.path,
      parentId: entity.parentId || null,
    };

    if (entity.description) data.description = entity.description;
    if (entity.image) data.image = entity.image;

    return data;
  }
}
