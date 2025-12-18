import axios from "axios";
import { CategoryModel } from "@/modules/Category.Module/infrastructure/models/Category.model";
import { DatabaseConnection } from "@/shared/database/DatabaseConnection";
import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify"; 

interface HierarchicalMenuData {
  name: string;
  description?: string;
  basePrice: number;
  sellingPrice: number;
  image?: string;
  path?: string;
  level?: number;
  parentId?: string | null;
  children?: HierarchicalMenuData[];
  products?: {
    name: string;
    description: string;
    image: string;
    tags: string[];
    basePrice: number;
    sellingPrice: number;
    variants: {
      name: string;
      basePrice: number;
      sellingPrice: number;
      isAvailable: boolean;
    }[];
  }[];
}

// Paste your hierarchicalMenuData here (unchanged)...
const hierarchicalMenuData: HierarchicalMenuData[] = [
  {
    name: "Ice Creams",
    description: "All ice cream varieties",
    basePrice: 0,
    sellingPrice: 0,
    children: [
      {
        name: "Cream-Based Ice Creams",
        description: "Rich creamy flavors",
        basePrice: 0,
        sellingPrice: 0,
        products: ["KitKat", "Biscoff", "Hazelnut"].map((name) => ({
          name,
          description: `${name} cream-based ice cream`,
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
          tags: ["ice-cream", "cream"],
          basePrice: 50,
          sellingPrice: 60,
          variants: [
            {
              name: "Single Scoop",
              basePrice: 50,
              sellingPrice: 60,
              isAvailable: true,
            },
            {
              name: "Double Scoop",
              basePrice: 85,
              sellingPrice: 100,
              isAvailable: true,
            },
          ],
        })),
      },
      // ...other child categories
    ],
  },
  // ...other root categories
];

const API_BASE = "https://localhost:5000/api";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ""; // Or seed admin first and use token

async function seedHierarchicalMenu() {
  const db = DatabaseConnection.getInstance();
  await db.connect(
    "mongodb+srv://mercedessuthan_db_user:lNJuvLuRkEF0BYT7@dev-cluster.hv10uwg.mongodb.net/"
  );

  console.log("🌱 Starting hierarchical menu seeding...\n");

  const buildPath = (parentPath: string | null, categoryId: string) =>
    parentPath ? `${parentPath}/${categoryId}` : categoryId;

  async function createCategory(
    categoryData: HierarchicalMenuData,
    parentId: mongoose.Types.ObjectId | null = null,
    level: number = 0,
    parentPath: string | null = null
  ): Promise<mongoose.Types.ObjectId> {
    console.log(
      `${"  ".repeat(level)}📁 Creating category: ${categoryData.name}`
    );

    const category = await CategoryModel.create({
      name: categoryData.name,
      ...(categoryData.description && {
        description: categoryData.description,
      }),
      slug: slugify(categoryData.name, { lower: true, strict: true }),
      ...(categoryData.description && {
        description: categoryData.description,
      }),
      ...(categoryData.image && { image: categoryData.image }),
      isActive: true,
      parentId: parentId,
      level: level,
      path: "temp",
    });

    const path = buildPath(parentPath, category._id.toString());
    category.path = path;
    await category.save();

    console.log(
      `${"  ".repeat(level)}✅ Category created: ${category.name} (ID: ${
        category._id
      })`
    );

    // Create products via API
    if (categoryData.products && categoryData.products.length > 0) {
      for (const productData of categoryData.products) {
        console.log(
          `${"  ".repeat(level + 1)}📦 Creating product via API: ${
            productData.name
          }`
        );
        try {
          await axios.post(
            `${API_BASE}/products`,
            {
              name: productData.name,
              description: productData.description,
              categoryId: category._id,
              basePrice: productData.basePrice,
              sellingPrice: productData.sellingPrice,
              variants: productData.variants,
              images: [productData.image],
              tags: productData.tags,
            },
            {
              headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            }
          );
          console.log(
            `${"  ".repeat(level + 1)}✅ Product created: ${productData.name}`
          );
        } catch (err: any) {
          console.error(
            `${"  ".repeat(level + 1)}❌ Failed to create product: ${
              productData.name
            }`,
            err.message
          );
        }
      }
    }

    // Recursive child categories
    if (categoryData.children && categoryData.children.length > 0) {
      for (const childData of categoryData.children) {
        await createCategory(childData, category._id, level + 1, path);
      }
    }

    return category._id;
  }

  try {
    for (const rootCategory of hierarchicalMenuData) {
      await createCategory(rootCategory);
    }

    console.log("\n🎉 Hierarchical menu seeding completed!");
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    throw error;
  } finally {
    await db.disconnect();
    process.exit(0);
  }
}

if (require.main === module) {
  seedHierarchicalMenu().catch((err) => {
    console.error("❌ Fatal error:", err);
    process.exit(1);
  });
}

export { seedHierarchicalMenu, hierarchicalMenuData };
