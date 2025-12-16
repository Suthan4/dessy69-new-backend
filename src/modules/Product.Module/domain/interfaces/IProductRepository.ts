import { ProductEntity, ProductVariant } from "../entities/Product.entity";

export interface IProductRepository {
  create(product: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findByCategoryId(
    categoryId: string,
    page: number,
    limit: number
  ): Promise<{ products: ProductEntity[]; total: number }>;
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ products: ProductEntity[]; total: number }>;
  update(
    id: string,
    data: Partial<ProductEntity>
  ): Promise<ProductEntity | null>;
  updateVariant(
    productId: string,
    variantId: string,
    data: Partial<ProductVariant>
  ): Promise<ProductEntity | null>;
  delete(id: string): Promise<boolean>;
  search(
    query: string,
    page: number,
    limit: number
  ): Promise<{ products: ProductEntity[]; total: number }>;
}
