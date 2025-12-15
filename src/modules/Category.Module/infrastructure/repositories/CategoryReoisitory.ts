
import { CategoryModel } from "../models/Category.model";
import { CategoryMapper } from "../mappers/Category.mapper";
import { ICategoryRepository } from "@/modules/Category.Module/domain/interfaces/ICategoryRepository";
import { Category } from "@/modules/Category.Module/domain/entities/Category.entity";

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