import { CategoryModel } from "@/modules/Category.Module/infrastructure/models/Category.model";
import { ProductModel } from "@/modules/Product.Module/infrastructure/models/Product.model";
import { DatabaseConnection } from "@/shared/database/DatabaseConnection";
import "dotenv/config";
import mongoose from "mongoose";

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
        products: [
          "KitKat",
          "Biscoff",
          "Hazelnut",
          "Honey Peanut",
          "Coco Almond",
          "Coffee",
          "Belgium Chocolate",
          "Cookie & Cream",
        ].map((name) => ({
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
      {
        name: "Fruit-Based Ice Creams",
        description: "Fresh fruit flavors",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          "Mango",
          "Chikku",
          "Grapes",
          "Jackfruit",
          "Muskmelon",
          "Blueberry",
          "Strawberry",
          "Tender Coconut",
          "Watermelon",
          "Guava",
          "Sitha Pal",
          "Pineapple",
          "Blackcurrant",
          "Blackberry",
          "Raspberry",
          "Apricot",
        ].map((name) => ({
          name,
          description: `${name} fruit ice cream`,
          image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
          tags: ["ice-cream", "fruit"],
          basePrice: 45,
          sellingPrice: 55,
          variants: [
            {
              name: "Single Scoop",
              basePrice: 45,
              sellingPrice: 55,
              isAvailable: true,
            },
            {
              name: "Double Scoop",
              basePrice: 80,
              sellingPrice: 95,
              isAvailable: true,
            },
          ],
        })),
      },
    ],
  },

  {
    name: "Beverages",
    description: "Cold & refreshing drinks",
    basePrice: 0,
    sellingPrice: 0,
    children: [
      {
        name: "Shakes",
        description: "Fruit-based shakes",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          "Blueberry",
          "Strawberry",
          "Blackcurrant",
          "Chikku",
          "Mango",
          "Jackfruit",
          "Muskmelon",
          "Watermelon",
        ].map((name) => ({
          name: `${name} Shake`,
          description: `${name} shake`,
          image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
          tags: ["shake"],
          basePrice: 70,
          sellingPrice: 80,
          variants: [
            {
              name: "Regular",
              basePrice: 70,
              sellingPrice: 80,
              isAvailable: true,
            },
            {
              name: "Large",
              basePrice: 105,
              sellingPrice: 120,
              isAvailable: true,
            },
          ],
        })),
      },

      {
        name: "Cold Beverages",
        description: "Flavored cold drinks",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          "KitKat",
          "Lotus Biscoff",
          "Nutella",
          "Peanut",
          "Boost",
          "Cold Boost",
          "Cold Horlicks",
        ].map((name) => ({
          name,
          description: `${name} cold beverage`,
          image: "https://images.unsplash.com/photo-1546173159-315724a31696",
          tags: ["cold-drink"],
          basePrice: 80,
          sellingPrice: 90,
          variants: [
            {
              name: "Regular",
              basePrice: 80,
              sellingPrice: 90,
              isAvailable: true,
            },
            {
              name: "Large",
              basePrice: 115,
              sellingPrice: 130,
              isAvailable: true,
            },
          ],
        })),
      },

      {
        name: "Cold Coffee",
        description: "Cold coffee specials",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          "Oreo Coffee Latte",
          "Iced Coffee Nutella",
          "Iced Coffee Latte",
          "Biscoff Espresso",
        ].map((name) => ({
          name,
          description: name,
          image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
          tags: ["coffee"],
          basePrice: 100,
          sellingPrice: 110,
          variants: [
            {
              name: "Regular",
              basePrice: 100,
              sellingPrice: 110,
              isAvailable: true,
            },
            {
              name: "Large",
              basePrice: 135,
              sellingPrice: 150,
              isAvailable: true,
            },
          ],
        })),
      },
    ],
  },

  {
    name: "Snacks & Quick Bites",
    description: "Snacks and Maggi",
    basePrice: 0,
    sellingPrice: 0,
    children: [
      {
        name: "Indian Snacks",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          {
            name: "Samosa",
            description: "Crispy potato samosa",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
            tags: ["snack"],
            basePrice: 25,
            sellingPrice: 30,
            variants: [
              { name: "2 Pieces", basePrice: 25, sellingPrice: 30, isAvailable: true },
              { name: "4 Pieces", basePrice: 45, sellingPrice: 55, isAvailable: true },
            ],
          },
        ],
      },

      {
        name: "Maggi Corner",
        basePrice: 0,
        sellingPrice: 0,
        products: [
          {
            name: "Veg Cheese Maggi",
            description: "Veg maggi with cheese",
            image: "https://images.unsplash.com/photo-1589308078055-918f8f4f57c3",
            tags: ["maggi"],
            basePrice: 70,
            sellingPrice: 80,
            variants: [
              { name: "Regular", basePrice: 70, sellingPrice: 80, isAvailable: true },
              { name: "Extra Cheese", basePrice: 8, sellingPrice: 10, isAvailable: true },
            ],
          },
        ],
      },
    ],
  },
];



async function seedHierarchicalMenu() {
  const db = DatabaseConnection.getInstance();
  await db.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://mercedessuthan_db_user:lNJuvLuRkEF0BYT7@dev-cluster.hv10uwg.mongodb.net/"
  );

  console.log("🌱 Starting hierarchical menu seeding...\n");

  // Helper function to build path using IDs
  const buildPath = (parentPath: string | null, categoryId: string): string => {
    return parentPath ? `${parentPath}/${categoryId}` : categoryId;
  };

  // Recursive function to create categories
  async function createCategory(
    categoryData: HierarchicalMenuData,
    parentId: mongoose.Types.ObjectId | null = null,
    level: number = 0,
    parentPath: string | null = null
  ): Promise<mongoose.Types.ObjectId> {
    console.log(
      `${"  ".repeat(level)}📁 Creating category: ${
        categoryData.name
      } (Level: ${level})`
    );

    const category = await CategoryModel.create({
      name: categoryData.name,
      ...(categoryData.description && {
        description: categoryData.description,
      }),
      ...(categoryData.image && { image: categoryData.image }),
      isActive: true,
      parentId: parentId,
      level: level,
      path: "temp", 
    });

    // Update path with actual category ID
    const path = buildPath(parentPath, category._id.toString());
    category.path = path;
    await category.save();

    console.log(
      `${"  ".repeat(level)}✅ Category created: ${category.name} (ID: ${
        category._id
      }, Path: ${path})\n`
    );

    // Create products for this category if any
    if (categoryData.products && categoryData.products.length > 0) {
      for (const productData of categoryData.products) {
        console.log(
          `${"  ".repeat(level + 1)}📦 Creating product: ${productData.name}`
        );

        const variants = productData.variants.map((v) => ({
          name: v.name,
          basePrice: v.basePrice,
          sellingPrice: v.sellingPrice,
          isAvailable: true,
        }));

        await ProductModel.create({
          name: productData.name,
          description: productData.description,
          categoryId: category._id,
          image: productData.image,
          basePrice: productData.basePrice,
          sellingPrice: productData.sellingPrice,
          variants: variants,
          isAvailable: true,
          popularity: 0,
          tags: productData.tags,
        });

        console.log(
          `${"  ".repeat(level + 1)}✅ Product created: ${productData.name} (${
            variants.length
          } variants)`
        );
      }
      console.log("");
    }

    // Create child categories recursively
    if (categoryData.children && categoryData.children.length > 0) {
      for (const childData of categoryData.children) {
        await createCategory(childData, category._id, level + 1, path);
      }
    }

    return category._id;
  }

  try {
    // Create all root categories and their children
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

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedHierarchicalMenu().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}

export { seedHierarchicalMenu, hierarchicalMenuData };
