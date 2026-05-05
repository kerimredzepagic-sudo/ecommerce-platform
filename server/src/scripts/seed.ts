import mongoose from "mongoose";
import { connectDatabase } from "../config";
import { Category, Product, User } from "../models";
import { hashPassword } from "../utils";

const ADMIN_EMAIL = "admin@shopkit.ba";
const ADMIN_PASSWORD = "Admin123!";

async function seedAdmin(): Promise<void> {
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.isVerified = true;
      existing.isActive = true;
      await existing.save();
      console.log(`[seed] Promoted existing user to admin: ${ADMIN_EMAIL}`);
    } else {
      console.log(`[seed] Admin already exists: ${ADMIN_EMAIL}`);
    }
    return;
  }

  await User.create({
    email: ADMIN_EMAIL,
    password: await hashPassword(ADMIN_PASSWORD),
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    provider: "email",
    isVerified: true,
    isActive: true,
    profileCompleted: true,
  });
  console.log(`[seed] Created admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

async function seedCategories(): Promise<Map<string, mongoose.Types.ObjectId>> {
  const categories = [
    { name: "Electronics", slug: "electronics", description: "Phones, laptops, accessories" },
    { name: "Clothing", slug: "clothing", description: "Apparel for all" },
    { name: "Home & Living", slug: "home-living", description: "Furniture and decor" },
  ];

  const map = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: { ...cat, level: 1, isActive: true, order: 0 } },
      { upsert: true, new: true }
    );
    map.set(cat.slug, doc._id);
  }
  console.log(`[seed] Categories ready: ${categories.map((c) => c.slug).join(", ")}`);
  return map;
}

async function seedProducts(catIds: Map<string, mongoose.Types.ObjectId>): Promise<void> {
  const products = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
      shortDescription: "Premium wireless audio.",
      price: 129.99,
      compareAtPrice: 169.99,
      category: catIds.get("electronics")!,
      stock: 25,
      isFeatured: true,
      tags: ["audio", "wireless"],
    },
    {
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "Soft 100% organic cotton t-shirt, available in multiple sizes.",
      shortDescription: "Everyday essential.",
      price: 19.99,
      category: catIds.get("clothing")!,
      stock: 100,
      tags: ["apparel", "cotton"],
    },
    {
      name: "Ceramic Plant Pot",
      slug: "ceramic-plant-pot",
      description: "Handmade ceramic pot, perfect for indoor plants.",
      shortDescription: "Minimalist home decor.",
      price: 24.5,
      category: catIds.get("home-living")!,
      stock: 40,
      tags: ["decor", "ceramic"],
    },
  ];

  for (const p of products) {
    await Product.findOneAndUpdate(
      { slug: p.slug },
      { $setOnInsert: p },
      { upsert: true, new: true }
    );
  }
  console.log(`[seed] Products ready: ${products.map((p) => p.slug).join(", ")}`);
}

async function main(): Promise<void> {
  await connectDatabase();
  await seedAdmin();
  const catIds = await seedCategories();
  await seedProducts(catIds);
  await mongoose.connection.close();
  console.log("[seed] Done.");
}

main().catch(async (err) => {
  console.error("[seed] Failed:", err);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
