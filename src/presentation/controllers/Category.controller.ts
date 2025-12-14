// import { ICategoryService } from "@/application/interface/IService";
// import { Request, Response } from "express";

// export class CategoryController {
//   constructor(private categoryService: ICategoryService) {}

//   createCategory = async (req: Request, res: Response) => {
//     try {
//       const category = await this.categoryService.createCategory(req.body);
//       res.status(201).json({ success: true, data: category });
//     } catch (error: any) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   getAllCategories = async (req: Request, res: Response) => {
//     try {
//       const { includeInactive } = req.query;
//       const categories = await this.categoryService.getAllCategories(
//         includeInactive === "true"
//       );
//       res.json({ success: true, data: categories });
//     } catch (error: any) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getCategoryById = async (req: Request, res: Response) => {
//     try {
//       const category = await this.categoryService.getCategoryById(
//         req.params.id as string
//       );
//       res.json({ success: true, data: category });
//     } catch (error: any) {
//       res.status(404).json({ success: false, message: error.message });
//     }
//   };

//   updateCategory = async (req: Request, res: Response) => {
//     try {
//       const category = await this.categoryService.updateCategory(
//         req.params.id as string,
//         req.body
//       );
//       res.json({ success: true, data: category });
//     } catch (error: any) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   deleteCategory = async (req: Request, res: Response) => {
//     try {
//       await this.categoryService.deleteCategory(req.params.id as string);
//       res.json({ success: true, message: "Category deleted successfully" });
//     } catch (error: any) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

//   getRootCategories = async (req: Request, res: Response) => {
//     try {
//       const roots = await this.categoryService.getRootCategories();
//       res.json({ success: true, data: roots });
//     } catch (error: any) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getChildCategories = async (req: Request, res: Response) => {
//     try {
//       const children = await this.categoryService.getChildCategories(
//         req.params.id as string
//       );
//       res.json({ success: true, data: children });
//     } catch (error: any) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getCategoryTree = async (req: Request, res: Response) => {
//     try {
//       const tree = await this.categoryService.getCategoryTree();
//       res.json({ success: true, data: tree });
//     } catch (error: any) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   getCategoryBreadcrumbs = async (req: Request, res: Response) => {
//     try {
//       const breadcrumbs = await this.categoryService.getCategoryBreadcrumbs(
//         req.params.id as string
//       );
//       res.json({ success: true, data: breadcrumbs });
//     } catch (error: any) {
//       res.status(404).json({ success: false, message: error.message });
//     }
//   };

//   moveCategory = async (req: Request, res: Response) => {
//     try {
//       const { newParentId } = req.body;
//       const category = await this.categoryService.moveCategory(
//         req.params.id as string,
//         newParentId
//       );
//       res.json({ success: true, data: category });
//     } catch (error: any) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };
// }
import { ICategoryService } from "@/application/interface/IService";
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

  getRootCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getRootCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getChildCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getChildCategories(
        req.params.id as string
      );
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getCategoryHierarchy = async (req: Request, res: Response) => {
    try {
      const hierarchy = await this.categoryService.getCategoryHierarchy();
      res.json({ success: true, data: hierarchy });
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

  getCategoryBreadcrumb = async (req: Request, res: Response) => {
    try {
      const breadcrumb = await this.categoryService.getCategoryBreadcrumb(
        req.params.id as string
      );
      res.json({ success: true, data: breadcrumb });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}