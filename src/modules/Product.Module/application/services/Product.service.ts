import { ICategoryRepository } from "@/modules/Category.Module/domain/interfaces/ICategoryRepository";
import { ProductEntity } from "../../domain/entities/Product.entity";
import { IProductRepository } from "../../domain/interfaces/IProductRepository";

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async createProduct(data: any): Promise<ProductEntity> {
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) throw new Error("Category not found");

    const existingSlug = await this.productRepository.findBySlug(data.slug);
    if (existingSlug) throw new Error("Slug already exists");

    const product = ProductEntity.create(
      data.name,
      data.slug,
      data.description,
      data.categoryId,
      data.basePrice,
      data.sellingPrice,
      data.variants || [],
      data.images || [],
      data.ingredients || []
    );

    return await this.productRepository.create(product);
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    return await this.productRepository.findById(id);
  }

  async getProducts(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ products: ProductEntity[]; total: number }> {
    return await this.productRepository.findAll(page, limit, filters);
  }

  async updateProduct(
    id: string,
    data: Partial<ProductEntity>
  ): Promise<ProductEntity | null> {
    return await this.productRepository.update(id, data);
  }

  async updateProductAvailability(
    id: string,
    isAvailable: boolean
  ): Promise<ProductEntity | null> {
    return await this.productRepository.update(id, { isAvailable });
  }

  async updateVariantAvailability(
    productId: string,
    variantId: string,
    isAvailable: boolean
  ): Promise<ProductEntity | null> {
    return await this.productRepository.updateVariant(productId, variantId, {
      isAvailable,
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.productRepository.delete(id);
  }

  async searchProducts(
    query: string,
    page: number,
    limit: number
  ): Promise<{ products: ProductEntity[]; total: number }> {
    return await this.productRepository.search(query, page, limit);
  }
}
