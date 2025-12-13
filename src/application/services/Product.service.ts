import { IProductRepository } from "@/domain/interfaces/IProductRepository";

import { IProductService } from "../interface/IService";
import { ProductServiceMapper } from "../mappers/ProductServiceMapper";
import { Product } from "@/domain/entities/Product.entity";
import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../dtos/ProductDTO";

export class ProductService implements IProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }
  async getProductById(id: string): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return ProductServiceMapper.mapToDTO(product);
  }
  async createProduct(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = new Product(
      "",
      data.name,
      data.description,
      data.category,
      data.basePrice,
      data.image,
      data.variants || [],
      data.isAvailable ?? true,
      data.isPopular ?? false,
      new Date(),
      new Date()
    );
    const created = await this.productRepository.create(product);
    return ProductServiceMapper.mapToDTO(created);
  }
  async updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<ProductResponseDTO> {
    const updated = await this.productRepository.update(id, data);
    if (!updated) throw new Error("Product not found");
    return ProductServiceMapper.mapToDTO(updated);
  }
  async deleteProduct(id: string): Promise<boolean> {
    return await this.productRepository.delete(id);
  }
  async getProductsByCategory(category: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findByCategory(category);
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }

  async getPopularProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findByPopular();
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }

  async updateAvailability(id: string, status: boolean): Promise<boolean> {
    return await this.productRepository.updateAvailability(id, status);
  }

  async searchProducts(query: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.searchProducts(query);
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }
}
