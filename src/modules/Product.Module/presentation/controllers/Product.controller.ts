import { Request, Response } from "express";
import { ProductService } from "../../application/services/Product.service";

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        isAvailable: req.query.isAvailable === "true",
        categoryId: req.query.categoryId as string,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
      };

      const result = await this.productService.getProducts(
        page,
        limit,
        filters
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id as string);
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id as string,
        req.body
      );
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isAvailable } = req.body;
      const product = await this.productService.updateProductAvailability(
        req.params.id as string,
        isAvailable
      );
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.productService.deleteProduct(req.params.id as string);
      if (!result) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.productService.searchProducts(
        query,
        page,
        limit
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
