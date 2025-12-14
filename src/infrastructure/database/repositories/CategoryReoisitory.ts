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
      createdAt: -1,
    });
    return docs.map((doc) => CategoryMapper.mapToEntity(doc));
  }

  async create(entity: Category): Promise<Category> {
    const doc = new CategoryModel(
      CategoryMapper.toPersistence(entity)
    );
    await doc.save();

    return CategoryMapper.mapToEntity(doc);
  }

  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find().sort({ createdAt: -1 });
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
