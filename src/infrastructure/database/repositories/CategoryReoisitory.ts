// import { Category } from "@/domain/entities/Category.entity";
// import { ICategoryRepository } from "@/domain/interfaces/ICategoryRepository";
// import { CategoryModel } from "../models/Category.model";
// import { CategoryMapper } from "../mappers/Category.mapper";
// import { Types } from "mongoose";

// export class CategoryRepository implements ICategoryRepository {
//   async findByName(name: string): Promise<Category | null> {
//     const doc = await CategoryModel.findOne({ name });
//     return doc ? CategoryMapper.mapToEntity(doc) : null;
//   }

//   async findActive(): Promise<Category[]> {
//     const docs = await CategoryModel.find({ isActive: true }).sort({ path: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findRoots(): Promise<Category[]> {
//     const docs = await CategoryModel.find({
//       level: 0,
//       isActive: true,
//     }).sort({ name: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findChildren(parentId: string): Promise<Category[]> {
//     const docs = await CategoryModel.find({
//       parentId: new Types.ObjectId(parentId),
//       isActive: true,
//     }).sort({ name: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findDescendants(categoryPath: string): Promise<Category[]> {
//     const docs = await CategoryModel.find({
//       path: { $regex: `^${this.escapeRegex(categoryPath)}` },
//       isActive: true,
//     }).sort({ path: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findAncestors(
//     categoryPath: string,
//     categoryId: string
//   ): Promise<Category[]> {
//     const ancestorIds = categoryPath
//       .split("/")
//       .filter((id) => id !== "" && id !== categoryId)
//       .map((id) => new Types.ObjectId(id));

//     if (ancestorIds.length === 0) return [];

//     const docs = await CategoryModel.find({
//       _id: { $in: ancestorIds },
//     }).sort({ level: 1 });

//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findByLevel(level: number): Promise<Category[]> {
//     const docs = await CategoryModel.find({
//       level,
//       isActive: true,
//     }).sort({ name: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async hasChildren(categoryId: string): Promise<boolean> {
//     const count = await CategoryModel.countDocuments({
//       parentId: new Types.ObjectId(categoryId),
//     });
//     return count > 0;
//   }

//   async updateDescendantPaths(
//     oldPath: string,
//     newPath: string
//   ): Promise<number> {
//     const result = await CategoryModel.updateMany(
//       { path: { $regex: `^${this.escapeRegex(oldPath)}` } },
//       [
//         {
//           $set: {
//             path: {
//               $concat: [newPath, { $substr: ["$path", oldPath.length, -1] }],
//             },
//             level: {
//               $add: [
//                 "$level",
//                 this.getPathLevel(newPath) - this.getPathLevel(oldPath),
//               ],
//             },
//           },
//         },
//       ]
//     );
//     return result.modifiedCount;
//   }

//   async create(entity: Category): Promise<Category> {
//     const doc = new CategoryModel(CategoryMapper.toPersistence(entity));
//     await doc.save();
//     return CategoryMapper.mapToEntity(doc);
//   }

//   async findAll(): Promise<Category[]> {
//     const docs = await CategoryModel.find().sort({ path: 1 });
//     return docs.map((doc) => CategoryMapper.mapToEntity(doc));
//   }

//   async findById(id: string): Promise<Category | null> {
//     const doc = await CategoryModel.findById(id);
//     return doc ? CategoryMapper.mapToEntity(doc) : null;
//   }

//   async update(
//     id: string,
//     payload: Partial<Category>
//   ): Promise<Category | null> {
//     const doc = await CategoryModel.findByIdAndUpdate(
//       id,
//       { ...payload, updatedAt: new Date() },
//       { new: true }
//     );
//     return doc ? CategoryMapper.mapToEntity(doc) : null;
//   }

//   async delete(id: string): Promise<boolean> {
//     const result = await CategoryModel.findByIdAndDelete(id);
//     return !!result;
//   }

//   private escapeRegex(str: string): string {
//     return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//   }

//   private getPathLevel(path: string): number {
//     return path.split("/").filter((p) => p !== "").length;
//   }
// }
import { Category } from "@/domain/entities/Category.entity";
import { ICategoryRepository } from "@/domain/interfaces/ICategoryRepository";
import { CategoryModel } from "../models/Category.model";
import { CategoryMapper } from "../mappers/Category.mapper";

export class CategoryRepository implements ICategoryRepository {
  async findByName(name: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ name });
    return doc ? CategoryMapper.mapToEntity(doc) : null;
  }

  async findActive(): Promise<Category[]> {
    const docs = await CategoryModel.find({ isActive: true }).sort({
      level: 1,
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findByParentId(parentId: string | null): Promise<Category[]> {
    const docs = await CategoryModel.find({
      parentId: parentId ? parentId : null,
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findByLevel(level: number): Promise<Category[]> {
    const docs = await CategoryModel.find({ level }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findRootCategories(): Promise<Category[]> {
    const docs = await CategoryModel.find({
      parentId: null,
      level: 0,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findChildCategories(parentId: string): Promise<Category[]> {
    const docs = await CategoryModel.find({
      parentId,
      isActive: true,
    }).sort({
      level: 1,
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findByPath(path: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ path });
    return doc ? CategoryMapper.mapToEntity(doc) : null;
  }

  async create(entity: Category): Promise<Category> {
    const doc = new CategoryModel(CategoryMapper.toPersistence(entity));
    await doc.save();
    return CategoryMapper.mapToEntity(doc);
  }

  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find().sort({
      level: 1,
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await CategoryModel.findById(id);
    return doc ? CategoryMapper.mapToEntity(doc) : null;
  }

  async update(
    id: string,
    payload: Partial<Category>
  ): Promise<Category | null> {
    const doc = await CategoryModel.findByIdAndUpdate(
      id,
      { ...payload, updatedAt: new Date() },
      { new: true }
    );
    return doc ? CategoryMapper.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }
}