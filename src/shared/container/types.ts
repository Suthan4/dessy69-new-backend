import { AuthService } from "@/modules/Auth.Module/application/services/Auth.service";
import { IUserRepository } from "@/modules/Auth.Module/domain/interfaces/IUserRepository";
import { AuthController } from "@/modules/Auth.Module/presentation/controllers/Auth.controller";
import { CategoryService } from "@/modules/Category.Module/application/services/Category.service";
import { ICategoryRepository } from "@/modules/Category.Module/domain/interfaces/ICategoryRepository";
import { CategoryController } from "@/modules/Category.Module/presentation/controllers/Category.controller";
import { CouponService } from "@/modules/Coupon.Module/application/services/Coupon.service";
import { ICouponRepository } from "@/modules/Coupon.Module/domain/interfaces/ICouponRepository";
import { CouponController } from "@/modules/Coupon.Module/presentation/controllers/Coupon.controllers";
import { OrderService } from "@/modules/Order.Module/application/services/Order.service";
import { IOrderRepository } from "@/modules/Order.Module/domain/interfaces/IOrderRepository";
import { OrderController } from "@/modules/Order.Module/presentation/controllers/Order.controller";
import { PaymentService } from "@/modules/Payment.Module/application/Payment.services";
import { PaymentController } from "@/modules/Payment.Module/presentation/controllers/Payment.controller";
import { ProductService } from "@/modules/Product.Module/application/services/Product.service";
import { IProductRepository } from "@/modules/Product.Module/domain/interfaces/IProductRepository";
import { ProductController } from "@/modules/Product.Module/presentation/controllers/Product.controller";

/**
 * Dependency Injection Type Identifiers
 * These symbols are used to register and resolve dependencies
 */
export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  CouponRepository: Symbol.for("CouponRepository"),
  OrderRepository: Symbol.for("OrderRepository"),

  // Services
  AuthService: Symbol.for("AuthService"),
  CategoryService: Symbol.for("CategoryService"),
  ProductService: Symbol.for("ProductService"),
  CouponService: Symbol.for("CouponService"),
  OrderService: Symbol.for("OrderService"),
  PaymentService: Symbol.for("PaymentService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  CategoryController: Symbol.for("CategoryController"),
  ProductController: Symbol.for("ProductController"),
  CouponController: Symbol.for("CouponController"),
  OrderController: Symbol.for("OrderController"),
  PaymentController: Symbol.for("PaymentController"),
} as const;

/**
 * Type mapping for dependency injection
 * This provides compile-time type safety when resolving dependencies
 */

export interface DITypes {
  // Repositories
  [TYPES.UserRepository]: IUserRepository;
  [TYPES.CategoryRepository]: ICategoryRepository;
  [TYPES.ProductRepository]: IProductRepository;
  [TYPES.CouponRepository]: ICouponRepository;
  [TYPES.OrderRepository]: IOrderRepository;

  // Services
  [TYPES.AuthService]: AuthService;
  [TYPES.CategoryService]: CategoryService;
  [TYPES.ProductService]: ProductService;
  [TYPES.CouponService]: CouponService;
  [TYPES.OrderService]: OrderService;
  [TYPES.PaymentService]: PaymentService;

  // Controllers
  [TYPES.AuthController]: AuthController;
  [TYPES.CategoryController]: CategoryController;
  [TYPES.ProductController]: ProductController;
  [TYPES.CouponController]: CouponController;
  [TYPES.OrderController]: OrderController;
  [TYPES.PaymentController]: PaymentController;
}
