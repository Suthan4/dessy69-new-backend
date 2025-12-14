import { Product } from "@/domain/entities/Product.entity";
import { IProductRepository } from "@/domain/interfaces/IProductRepository";
import { ProductModel } from "../models/Product.model";
import { ProductMapper } from "../mappers/Product.mapper";

export class ProductRepository implements IProductRepository {
  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const docs = await ProductModel.find({
      categoryId,
      isAvailable: true,
    })
      .populate("categoryId", "name")
      .sort({ popularity: -1, name: 1 });
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }

  async findByPopular(): Promise<Product[]> {
    const docs = await ProductModel.find({ isAvailable: true })
      .populate("categoryId", "name")
      .sort({ popularity: -1 })
      .limit(10);
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }

  async findAvailable(): Promise<Product[]> {
    const docs = await ProductModel.find({ isAvailable: true }).populate(
      "categoryId",
      "name"
    );
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }

  async updateAvailability(id: string, status: boolean): Promise<boolean> {
    const result = await ProductModel.findByIdAndUpdate(id, {
      isAvailable: status,
      updatedAt: new Date(),
    });
    return !!result;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const docs = await ProductModel.find({
      $text: { $search: query },
      isAvailable: true,
    })
      .populate("categoryId", "name")
      .limit(20);
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }

  async incrementPopularity(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndUpdate(id, {
      $inc: { popularity: 1 },
    });
    return !!result;
  }

  async create(entity: Product): Promise<Product> {
    const doc = await ProductModel.create(ProductMapper.toPersistence(entity));
    const populated = await doc.populate("categoryId", "name");
    return ProductMapper.mapToEntity(populated);
  }

  async findAll(): Promise<Product[]> {
    const docs = await ProductModel.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id).populate("categoryId", "name");
    return doc ? ProductMapper.mapToEntity(doc) : null;
  }

  async update(id: string, payload: Partial<Product>): Promise<Product | null> {
    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { ...payload, updatedAt: new Date() },
      { new: true }
    ).populate("categoryId", "name");
    return doc ? ProductMapper.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }
}
