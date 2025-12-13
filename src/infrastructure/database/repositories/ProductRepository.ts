import { Product } from "@/domain/entities/Product.entity";
import { IProductRepository } from "@/domain/interfaces/IProductRepository";
import { ProductModel } from "../models/Product.model";
import { ProductMapper } from "../mappers/Product.mapper";

export class ProductRepository implements IProductRepository {
  async findByCategory(category: string): Promise<Product[]> {
    const docs = await ProductModel.find({
      category,
      isAvailable: true,
    }).sort({ isPopular: -1, name: 1 });
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }
  async findByPopular(): Promise<Product[]> {
    const docs = await ProductModel.find({
      isPopular: true,
      isAvailable: true,
    }).limit(10);
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }
  async findAvailable(): Promise<Product[]> {
    const docs = await ProductModel.find({
      isAvailable: true,
    });
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }
  async updateAvailability(id: string, status: boolean): Promise<boolean> {
    const result = await ProductModel.findByIdAndUpdate(id, {
      isAvailable: status,
    });
    return !!result;
  }
  async searchProducts(query: string): Promise<Product[]> {
    const docs = await ProductModel.find({
      $text: { $search: query },
      isAvaialble: true,
    }).limit(20);
    return docs.map((doc) => ProductMapper.mapToEntity(doc));
  }
  async create(entity: Product): Promise<Product> {
    const res = await ProductModel.create({
      name: entity.name,
      description: entity.description,
      category: entity.category,
      basePrice: entity.basePrice,
      image: entity.image,
      variants: entity.variants,
      isAvailable: entity.isAvailable,
      isPopular: entity.isPopular,
    });
    return ProductMapper.mapToEntity(res);
  }
  async findAll(): Promise<Product[]> {
    const res = await ProductModel.find().sort({ createAt: -1 }).exec();
    return res.map((doc) => ProductMapper.mapToEntity(doc));
  }
  async findById(id: string): Promise<Product | null> {
    const res = await ProductModel.findById(id).exec();
    return res ? ProductMapper.mapToEntity(res) : null;
  }
  async update(id: string, payload: Partial<Product>): Promise<Product | null> {
    const res = await ProductModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return res ? ProductMapper.mapToEntity(res) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }
}
