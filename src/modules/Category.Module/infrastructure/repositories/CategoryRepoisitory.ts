import { CategoryEntity } from "../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository";
import { CategoryModel } from "../models/Category.model";

export class CategoryRepository implements ICategoryRepository {
  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const doc = await CategoryModel.create({
      name: category.name,
      slug: category.slug,
      path: category.path,
      description: category.description,
      parentId: category.parentId,
      level: category.level,
      isActive: category.isActive,
    });
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findOne({ slug });
    return doc ? this.toEntity(doc) : null;
  }

  async findByPath(path: string): Promise<CategoryEntity[]> {
    const docs = await CategoryModel.find({ path });
    return docs.map((d) => this.toEntity(d));
  }

  async findChildren(parentId: string): Promise<CategoryEntity[]> {
    const docs = await CategoryModel.find({ parentId });
    return docs.map((d) => this.toEntity(d));
  }

  async findDescendants(path: string): Promise<CategoryEntity[]> {
    // Find all categories where path starts with the given path
    const docs = await CategoryModel.find({ path: new RegExp(`^${path}`) });
    return docs.map((d) => this.toEntity(d));
  }

  async update(
    id: string,
    data: Partial<CategoryEntity>
  ): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const docs = await CategoryModel.find().sort({ path: 1 });
    return docs.map((d) => this.toEntity(d));
  }

  private toEntity(doc: any): CategoryEntity {
    return new CategoryEntity(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.path,
      doc.description,
      doc.parentId?.toString(),
      doc.level,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
