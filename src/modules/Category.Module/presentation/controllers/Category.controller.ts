import { Request, Response } from "express";
import { CategoryService } from "../../application/services/Category.service";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug, parentId } = req.body;
      const category = await this.categoryService.createCategory(
        name,
        slug,
        parentId
      );
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getCategoryTree = async (req: Request, res: Response): Promise<void> => {
    try {
      const tree = await this.categoryService.getCategoryTree();
      res.json({ success: true, data: tree });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id as string
      );
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;
      const category = await this.categoryService.updateCategory(
        req.params.id as string,
        name,
        description
      );
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id as string);
      if (!result) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
