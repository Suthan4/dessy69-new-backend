// src/scripts/seedMenu.ts
import { DatabaseConnection } from "@/infrastructure/database/DatabaseConnection";
import { CategoryModel } from "@/infrastructure/database/models/Category.model";
import { ProductModel } from "@/infrastructure/database/models/Product.model";
import "dotenv/config";
import mongoose from "mongoose";

interface HierarchicalMenuData {
  name: string;
  description?: string;
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
    variants: {
      name: string;
      price: number;
    }[];
  }[];
}

const hierarchicalMenuData: HierarchicalMenuData[] = [
  {
    name: "Ice Creams",
    description: "Delicious ice cream varieties",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    children: [
      {
        name: "Cream-Based Ice Creams",
        description: "Rich and creamy ice cream flavors",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
        products: [
          {
            name: "KitKat Ice Cream",
            description:
              "Crunchy KitKat chocolate pieces blended with creamy ice cream",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["chocolate", "cream", "popular"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
              { name: "Family Pack", price: 180 },
            ],
          },
          {
            name: "Biscoff Ice Cream",
            description:
              "Lotus Biscoff cookie ice cream with caramelized flavor",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "cookie", "premium"],
            variants: [
              { name: "Single Scoop", price: 70 },
              { name: "Double Scoop", price: 110 },
              { name: "Family Pack", price: 200 },
            ],
          },
          {
            name: "Hazelnut Ice Cream",
            description: "Smooth hazelnut cream ice cream",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "nuts"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
          {
            name: "Honey Peanut Ice Cream",
            description: "Sweet honey with crunchy peanuts",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "nuts", "honey"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
            ],
          },
          {
            name: "Coco Almond Ice Cream",
            description: "Coconut and almond fusion",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "nuts", "coconut"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
          {
            name: "Coffee Ice Cream",
            description: "Rich coffee flavored cream ice cream",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "coffee"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Belgium Chocolate Ice Cream",
            description: "Premium Belgium chocolate ice cream",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "chocolate", "premium"],
            variants: [
              { name: "Single Scoop", price: 70 },
              { name: "Double Scoop", price: 120 },
              { name: "Family Pack", price: 210 },
            ],
          },
          {
            name: "Cookie & Cream Ice Cream",
            description: "Classic cookies and cream combination",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
            tags: ["cream", "cookie", "popular"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
            ],
          },
        ],
      },
      {
        name: "Fruit-Based Ice Creams",
        description: "Fresh and fruity natural ice creams",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
        products: [
          {
            name: "Mango Ice Cream",
            description: "Seasonal fresh mango ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "seasonal", "popular"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Chikku Ice Cream",
            description: "Sweet chikku fruit ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 50 },
              { name: "Double Scoop", price: 90 },
            ],
          },
          {
            name: "Grapes Ice Cream",
            description: "Fresh grape ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Jackfruit Ice Cream",
            description: "Seasonal jackfruit ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "seasonal"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
            ],
          },
          {
            name: "Muskmelon Ice Cream",
            description: "Sweet muskmelon ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 50 },
              { name: "Double Scoop", price: 90 },
            ],
          },
          {
            name: "Blueberry Ice Cream",
            description: "Rich blueberry flavored ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
          {
            name: "Strawberry Ice Cream",
            description: "Fresh strawberry fruit ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "popular"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
            ],
          },
          {
            name: "Tender Coconut Ice Cream",
            description: "Fresh tender coconut ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "coconut"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Watermelon Ice Cream",
            description: "Refreshing watermelon ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "refreshing"],
            variants: [
              { name: "Single Scoop", price: 50 },
              { name: "Double Scoop", price: 90 },
            ],
          },
          {
            name: "Guava Ice Cream",
            description: "Tropical guava ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "tropical"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Sitha Pal Ice Cream",
            description: "Custard apple ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "seasonal"],
            variants: [
              { name: "Single Scoop", price: 60 },
              { name: "Double Scoop", price: 100 },
            ],
          },
          {
            name: "Pineapple Ice Cream",
            description: "Tangy pineapple ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit", "tangy"],
            variants: [
              { name: "Single Scoop", price: 55 },
              { name: "Double Scoop", price: 95 },
            ],
          },
          {
            name: "Blackcurrant Ice Cream",
            description: "Rich blackcurrant ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
          {
            name: "Blackberry Ice Cream",
            description: "Sweet blackberry ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
          {
            name: "Raspberry Ice Cream",
            description: "Tangy raspberry ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 70 },
              { name: "Double Scoop", price: 110 },
            ],
          },
          {
            name: "Apricot Ice Cream",
            description: "Sweet apricot ice cream",
            image:
              "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
            tags: ["fruit"],
            variants: [
              { name: "Single Scoop", price: 65 },
              { name: "Double Scoop", price: 105 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Beverages",
    description: "Refreshing drinks and beverages",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696",
    children: [
      {
        name: "Shakes",
        description: "Thick and creamy fruit shakes",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
        products: [
          {
            name: "Blueberry Shake",
            description: "Thick blueberry shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit"],
            variants: [
              { name: "Regular", price: 80 },
              { name: "Large", price: 120 },
            ],
          },
          {
            name: "Strawberry Shake",
            description: "Fresh strawberry shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit", "popular"],
            variants: [
              { name: "Regular", price: 85 },
              { name: "Large", price: 125 },
            ],
          },
          {
            name: "Blackcurrant Shake",
            description: "Rich blackcurrant shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit"],
            variants: [
              { name: "Regular", price: 85 },
              { name: "Large", price: 125 },
            ],
          },
          {
            name: "Chikku Shake",
            description: "Sweet chikku shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit"],
            variants: [
              { name: "Regular", price: 75 },
              { name: "Large", price: 115 },
            ],
          },
          {
            name: "Mango Shake",
            description: "Seasonal fresh mango shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit", "seasonal"],
            variants: [
              { name: "Regular", price: 80 },
              { name: "Large", price: 120 },
            ],
          },
          {
            name: "Jackfruit Shake",
            description: "Seasonal jackfruit shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit", "seasonal"],
            variants: [
              { name: "Regular", price: 85 },
              { name: "Large", price: 125 },
            ],
          },
          {
            name: "Muskmelon Shake",
            description: "Sweet muskmelon shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit"],
            variants: [
              { name: "Regular", price: 75 },
              { name: "Large", price: 115 },
            ],
          },
          {
            name: "Watermelon Shake",
            description: "Refreshing watermelon shake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            tags: ["shake", "fruit", "refreshing"],
            variants: [
              { name: "Regular", price: 70 },
              { name: "Large", price: 110 },
            ],
          },
        ],
      },
      {
        name: "Cold Beverages",
        description: "Refreshing cold drinks",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696",
        products: [
          {
            name: "KitKat Beverage",
            description: "Chilled KitKat chocolate drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "chocolate"],
            variants: [
              { name: "Regular", price: 90 },
              { name: "Large", price: 130 },
            ],
          },
          {
            name: "Lotus Biscoff Beverage",
            description: "Cold Biscoff cookie drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "cookie"],
            variants: [
              { name: "Regular", price: 95 },
              { name: "Large", price: 135 },
            ],
          },
          {
            name: "Nutella Beverage",
            description: "Chilled Nutella chocolate drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "chocolate"],
            variants: [
              { name: "Regular", price: 100 },
              { name: "Large", price: 140 },
            ],
          },
          {
            name: "Peanut Beverage",
            description: "Creamy peanut butter drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "nuts"],
            variants: [
              { name: "Regular", price: 85 },
              { name: "Large", price: 125 },
            ],
          },
          {
            name: "Boost",
            description: "Hot Boost health drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["hot", "health"],
            variants: [
              { name: "Regular", price: 60 },
              { name: "Large", price: 90 },
            ],
          },
          {
            name: "Cold Boost",
            description: "Chilled Boost health drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "health"],
            variants: [
              { name: "Regular", price: 70 },
              { name: "Large", price: 100 },
            ],
          },
          {
            name: "Cold Horlicks",
            description: "Chilled Horlicks drink",
            image: "https://images.unsplash.com/photo-1546173159-315724a31696",
            tags: ["cold", "health"],
            variants: [
              { name: "Regular", price: 70 },
              { name: "Large", price: 100 },
            ],
          },
        ],
      },
      {
        name: "Cold Coffee",
        description: "Premium cold coffee varieties",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
        products: [
          {
            name: "Oreo Coffee Latte",
            description: "Oreo cookies blended with cold coffee",
            image:
              "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
            tags: ["coffee", "cold", "cookie"],
            variants: [
              { name: "Regular", price: 110 },
              { name: "Large", price: 150 },
            ],
          },
          {
            name: "Iced Coffee Nutella",
            description: "Nutella blended with iced coffee",
            image:
              "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
            tags: ["coffee", "cold", "chocolate"],
            variants: [
              { name: "Regular", price: 115 },
              { name: "Large", price: 155 },
            ],
          },
          {
            name: "Iced Coffee Latte",
            description: "Classic iced coffee latte",
            image:
              "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
            tags: ["coffee", "cold", "popular"],
            variants: [
              { name: "Regular", price: 95 },
              { name: "Large", price: 135 },
            ],
          },
          {
            name: "Biscoff Espresso",
            description: "Biscoff cookie with espresso",
            image:
              "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
            tags: ["coffee", "cold", "cookie"],
            variants: [
              { name: "Regular", price: 120 },
              { name: "Large", price: 160 },
            ],
          },
        ],
      },
      {
        name: "Fresh Juice",
        description: "Freshly squeezed juices",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
        products: [
          {
            name: "Watermelon Juice",
            description: "Fresh watermelon juice",
            image:
              "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
            tags: ["juice", "fresh", "healthy"],
            variants: [
              { name: "Regular", price: 50 },
              { name: "Large", price: 80 },
            ],
          },
          {
            name: "Muskmelon Juice",
            description: "Sweet muskmelon juice",
            image:
              "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
            tags: ["juice", "fresh", "healthy"],
            variants: [
              { name: "Regular", price: 55 },
              { name: "Large", price: 85 },
            ],
          },
          {
            name: "Lemonade",
            description: "Refreshing lemon juice",
            image:
              "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
            tags: ["juice", "fresh", "refreshing"],
            variants: [
              { name: "Regular", price: 40 },
              { name: "Large", price: 70 },
            ],
          },
        ],
      },
      {
        name: "Soda",
        description: "Fizzy refreshing sodas",
        image: "https://images.unsplash.com/photo-1622543925917-763c34c1a86e",
        products: [
          {
            name: "Virgin Mojito",
            description: "Refreshing mint mojito",
            image:
              "https://images.unsplash.com/photo-1622543925917-763c34c1a86e",
            tags: ["soda", "mint", "refreshing"],
            variants: [
              { name: "Regular", price: 70 },
              { name: "Large", price: 100 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Snacks & Quick Bites",
    description: "Delicious snacks and fast food",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    children: [
      {
        name: "Indian Snacks",
        description: "Traditional Indian snacks",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        products: [
          {
            name: "Samosa",
            description: "Crispy potato filled samosa",
            image:
              "https://images.unsplash.com/photo-1601050690597-df0568f70950",
            tags: ["snack", "indian", "popular"],
            variants: [
              { name: "2 Pieces", price: 30 },
              { name: "4 Pieces", price: 55 },
            ],
          },
          {
            name: "Bajji",
            description: "Mixed vegetable bajji",
            image:
              "https://images.unsplash.com/photo-1601050690597-df0568f70950",
            tags: ["snack", "indian"],
            variants: [
              { name: "Small Plate", price: 40 },
              { name: "Large Plate", price: 70 },
            ],
          },
        ],
      },
      {
        name: "Quick Bites",
        description: "Fast food quick bites",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710",
        products: [
          {
            name: "Veg Nuggets",
            description: "Crispy vegetable nuggets",
            image: "https://images.unsplash.com/photo-1562967914-608f82629710",
            tags: ["snack", "fried"],
            variants: [
              { name: "Medium (8 pcs)", price: 80 },
              { name: "Large (16 pcs)", price: 150 },
              { name: "Medium + Peri Peri", price: 85 },
              { name: "Large + Peri Peri", price: 155 },
            ],
          },
          {
            name: "Veg Fingers",
            description: "Crunchy vegetable fingers",
            image: "https://images.unsplash.com/photo-1562967914-608f82629710",
            tags: ["snack", "fried"],
            variants: [
              { name: "Medium (4 pcs)", price: 70 },
              { name: "Large (8 pcs)", price: 130 },
              { name: "Medium + Peri Peri", price: 75 },
              { name: "Large + Peri Peri", price: 135 },
            ],
          },
          {
            name: "Cheese Potato Shots",
            description: "Cheesy potato bites",
            image: "https://images.unsplash.com/photo-1562967914-608f82629710",
            tags: ["snack", "cheese"],
            variants: [
              { name: "Medium (5 pcs)", price: 85 },
              { name: "Large (10 pcs)", price: 160 },
            ],
          },
          {
            name: "Cheese Corn Shots",
            description: "Cheesy corn bites",
            image: "https://images.unsplash.com/photo-1562967914-608f82629710",
            tags: ["snack", "cheese"],
            variants: [
              { name: "Medium (4 pcs)", price: 80 },
              { name: "Large (8 pcs)", price: 150 },
            ],
          },
          {
            name: "French Fries",
            description: "Crispy golden french fries",
            image: "https://images.unsplash.com/photo-1562967914-608f82629710",
            tags: ["snack", "fries", "popular"],
            variants: [
              { name: "Medium (Salted)", price: 60 },
              { name: "Large (Salted)", price: 110 },
              { name: "Medium (Peri Peri)", price: 65 },
              { name: "Large (Peri Peri)", price: 115 },
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
      description: categoryData.description,
      image: categoryData.image,
      isActive: true,
      parentId: parentId,
      level: level,
      path: "temp", // Temporary, will update after getting ID
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
          price: v.price,
          isAvailable: true,
        }));

        await ProductModel.create({
          name: productData.name,
          description: productData.description,
          categoryId: category._id,
          image: productData.image,
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
