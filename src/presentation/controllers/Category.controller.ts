import { ICategoryService } from "@/application/services/Category.service";
import { Request, Response } from "express";

export class CategoryController {
  constructor(private categoryService: ICategoryService) {}

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const { includeInactive } = req.query;
      const categories = await this.categoryService.getAllCategories(
        includeInactive === "true"
      );
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id as string
      );
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.id as string,
        req.body
      );
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(req.params.id as string);
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
