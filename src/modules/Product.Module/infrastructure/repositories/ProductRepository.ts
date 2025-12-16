import { ProductEntity, ProductVariant } from "../../domain/entities/Product.entity";
import { IProductRepository } from "../../domain/interfaces/IProductRepository";
import { ProductModel } from "../models/Product.model";

export class ProductRepository implements IProductRepository {
  async create(product: ProductEntity): Promise<ProductEntity> {
    const doc = await ProductModel.create({
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      sellingPrice: product.sellingPrice,
      isAvailable: product.isAvailable,
      variants: product.variants,
      images: product.images,
      ingredients: product.ingredients,
      nutritionInfo: product.nutritionInfo
    });
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOne({ slug });
    return doc ? this.toEntity(doc) : null;
  }

  async findByCategoryId(categoryId: string, page: number, limit: number): Promise<{ products: ProductEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      ProductModel.find({ categoryId }).skip(skip).limit(limit),
      ProductModel.countDocuments({ categoryId })
    ]);
    return { products: docs.map(d => this.toEntity(d)), total };
  }

  async findAll(page: number, limit: number, filters: any = {}): Promise<{ products: ProductEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};
    
    if (filters.isAvailable !== undefined) query.isAvailable = filters.isAvailable;
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.minPrice) query.sellingPrice = { $gte: filters.minPrice };
    if (filters.maxPrice) query.sellingPrice = { ...query.sellingPrice, $lte: filters.maxPrice };

    const [docs, total] = await Promise.all([
      ProductModel.find(query).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ]);
    return { products: docs.map(d => this.toEntity(d)), total };
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async updateVariant(productId: string, variantId: string, data: Partial<ProductVariant>): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOneAndUpdate(
      { _id: productId, 'variants._id': variantId },
      { $set: { 'variants.$': data } },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  async search(query: string, page: number, limit: number): Promise<{ products: ProductEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      ProductModel.find({ $text: { $search: query } }).skip(skip).limit(limit),
      ProductModel.countDocuments({ $text: { $search: query } })
    ]);
    return { products: docs.map(d => this.toEntity(d)), total };
  }

  private toEntity(doc: any): ProductEntity {
    return new ProductEntity(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.description,
      doc.categoryId.toString(),
      doc.basePrice,
      doc.sellingPrice,
      doc.isAvailable,
      doc.variants.map((v: any) => ({
        id: v._id.toString(),
        name: v.name,
        size: v.size,
        basePrice: v.basePrice,
        sellingPrice: v.sellingPrice,
        isAvailable: v.isAvailable
      })),
      doc.images,
      doc.ingredients,
      doc.nutritionInfo,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
