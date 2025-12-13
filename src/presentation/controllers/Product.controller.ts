import { IProductService } from "@/application/interface/IService";
import { Request, Response } from "express";
import { ProductSchema } from "../validators/schema";

export class ProductController {
  constructor(private productService: IProductService) {}

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(req.params.id as string);
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const validated = ProductSchema.parse(req.body);
      const product = await this.productService.createProduct(validated);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id as string,
        req.body
      );
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(req.params.id as string);
      res.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getPopularProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getPopularProducts();
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateAvailability = async (req: Request, res: Response) => {
    try {
      await this.productService.updateAvailability(
        req.params.id as string,
        req.body.isAvailable
      );

      // Emit socket event for real-time update
      const io = (req as any).io;
      io.emit("product:availability", {
        productId: req.params.id as string,
        isAvailable: req.body.isAvailable,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
