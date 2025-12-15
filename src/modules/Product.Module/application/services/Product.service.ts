
import { IProductRepository } from "@/modules/Product.Module/domain/interfaces/IProductRepository";
import { IProductService } from "../interface/IProductService";
import { ProductServiceMapper } from "../mappers/ProductServiceMapper";

import { Types } from "mongoose";
import { ICategoryRepository } from "@/modules/Category.Module/domain/interfaces/ICategoryRepository";
import { Product } from "@/modules/Product.Module/domain/entities/Product.entity";
import { SocketManager } from "@/shared/infrastructure/SocketManager";
import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../DTOs/ProductDTO";

export class ProductService implements IProductService {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

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
    // Validate category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) throw new Error("Category not found");

    const product = new Product(
      "",
      data.name,
      data.description,
      new Types.ObjectId(data.categoryId),
      data.image,
      data.variants || [],
      data.isAvailable ?? true,
      data.popularity ?? 0,
      data.tags || [],
      new Date(),
      new Date()
    );

    const created = await this.productRepository.create(product);
    const dto = ProductServiceMapper.mapToDTO(created);

    // Emit socket event
    const socketManager = SocketManager.getInstance();
    socketManager.broadcast("menu:created", dto);

    return dto;
  }

  async updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<ProductResponseDTO> {
    // If categoryId is being updated, validate it exists
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) throw new Error("Category not found");
    }

    const updated = await this.productRepository.update(id, data as any);
    if (!updated) throw new Error("Product not found");

    const dto = ProductServiceMapper.mapToDTO(updated);

    // Emit socket event
    const socketManager = SocketManager.getInstance();
    socketManager.broadcast("menu:updated", dto);

    return dto;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);

    if (result) {
      const socketManager = SocketManager.getInstance();
      socketManager.broadcast("menu:deleted", { id });
    }

    return result;
  }

  async getProductsByCategory(
    categoryId: string
  ): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findByCategoryId(categoryId);
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }

  async getPopularProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findByPopular();
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }

  async updateAvailability(id: string, status: boolean): Promise<boolean> {
    const result = await this.productRepository.updateAvailability(id, status);

    if (result) {
      const socketManager = SocketManager.getInstance();
      socketManager.broadcast("product:availability", {
        productId: id,
        isAvailable: status,
      });
    }

    return result;
  }

  async searchProducts(query: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.searchProducts(query);
    return products.map((p) => ProductServiceMapper.mapToDTO(p));
  }
}
