/**
 * WooCommerce CSV Import Script
 *
 * This script imports products from a WooCommerce CSV export:
 * 1. Creates categories from hierarchical paths (e.g., "Med > Prirodni med")
 * 2. Downloads images from WordPress and uploads them to Google Cloud Storage
 * 3. Creates products with variants (variable products + variations)
 * 4. Handles nutritional values and other custom fields
 *
 * Usage:
 *   npx ts-node scripts/import-woocommerce.ts <csv-file-path>
 *
 * Example:
 *   npx ts-node scripts/import-woocommerce.ts wordpress-woocomerce-med.csv
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import mongoose from "mongoose";
import { config } from "dotenv";
import {
  Product,
  IProductImage,
  IProductVariant,
} from "../src/models/Product.model";
import { Category, ICategory } from "../src/models/Category.model";
import { uploadService } from "../src/services/upload.service";

// Load environment variables
config();

// Constants
const BATCH_SIZE = 5; // Process products in batches to avoid memory issues
const IMAGE_DOWNLOAD_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// CSV column mappings (Bosnian to English)
const COLUMN_MAP: Record<string, string> = {
  ID: "id",
  Vrsta: "type",
  SKU: "sku",
  "GTIN, UPC, EAN, or ISBN": "barcode",
  Naziv: "name",
  Objavljeno: "published",
  "Istaknuto?": "featured",
  "Vidljivost u katalogu": "visibility",
  "Kratak opis": "shortDescription",
  Opis: "description",
  "Datum početka sniženja": "saleStartDate",
  "Datum kraja sniženja": "saleEndDate",
  "Status poreza": "taxStatus",
  "Klasa poreza": "taxClass",
  "Na stanju?": "inStock",
  Zaliha: "stock",
  "Nisko stanje zalihe": "lowStockThreshold",
  "Narudžbe na upit dozvoljene?": "allowBackorder",
  "Težina (kg)": "weight",
  "Dužina (cm)": "length",
  "Širina (cm)": "width",
  "Visina (cm)": "height",
  "Snižena cijena:": "salePrice",
  "Normalna cijena:": "regularPrice",
  Kategorije: "categories",
  Oznake: "tags",
  Slike: "images",
  Glavni: "parentSku",
  Pozicija: "position",
  Brands: "brand",
  "Atribut 1 ime": "attribute1Name",
  "Atribut 1 vrijednosti": "attribute1Values",
};

interface WooCommerceRow {
  id: string;
  type: string;
  sku: string;
  barcode?: string;
  name: string;
  published: string;
  featured: string;
  visibility: string;
  shortDescription?: string;
  description?: string;
  saleStartDate?: string;
  saleEndDate?: string;
  taxStatus?: string;
  taxClass?: string;
  inStock?: string;
  stock?: string;
  lowStockThreshold?: string;
  allowBackorder?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  salePrice?: string;
  regularPrice?: string;
  categories?: string;
  tags?: string;
  images?: string;
  parentSku?: string;
  position?: string;
  brand?: string;
  attribute1Name?: string;
  attribute1Values?: string;
  // Nutritional values from meta fields
  nutritionalValues?: Array<{ name: string; value: string }>;
  [key: string]: any;
}

interface ImportStats {
  categoriesCreated: number;
  productsCreated: number;
  productsUpdated: number;
  variantsCreated: number;
  imagesUploaded: number;
  errors: string[];
}

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[čć]/g, "c")
    .replace(/[šś]/g, "s")
    .replace(/[žź]/g, "z")
    .replace(/đ/g, "dj")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Parse price string (handles "10,00" format)
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  // Replace comma with dot for decimal
  const cleaned = priceStr.replace(",", ".").replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

// Parse boolean from WooCommerce format
function parseBoolean(value?: string): boolean {
  return (
    value === "1" ||
    value?.toLowerCase() === "yes" ||
    value?.toLowerCase() === "true"
  );
}

// Download image from URL with retries
async function downloadImage(
  url: string,
  retries = MAX_RETRIES
): Promise<Buffer | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        IMAGE_DOWNLOAD_TIMEOUT
      );

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.log(
        `  ⚠ Image download attempt ${attempt}/${retries} failed for ${url}: ${error.message}`
      );
      if (attempt === retries) {
        return null;
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
}

// Upload image to GCS
async function uploadImageToGCS(
  imageUrl: string,
  productSlug: string,
  index: number
): Promise<string | null> {
  try {
    const buffer = await downloadImage(imageUrl);
    if (!buffer) {
      console.log(`  ⚠ Failed to download image: ${imageUrl}`);
      return null;
    }

    // Get file extension from URL
    const urlPath = new URL(imageUrl).pathname;
    const ext = path.extname(urlPath) || ".jpg";
    const fileName = `${productSlug}-${index}${ext}`;

    const result = await uploadService.uploadFile(buffer, fileName, {
      folder: "products",
      contentType: `image/${ext.replace(".", "")}`,
      isPublic: true,
    });

    console.log(`  ✓ Uploaded image: ${fileName}`);
    return result.url;
  } catch (error: any) {
    console.log(`  ⚠ Failed to upload image: ${error.message}`);
    return null;
  }
}

// Parse nutritional values from CSV row
function parseNutritionalValues(
  row: Record<string, any>
): Array<{ name: string; value: string }> {
  const values: Array<{ name: string; value: string }> = [];

  for (let i = 0; i <= 7; i++) {
    const nameKey = `Meta: nutritivne_vrijednosti_${i}_naziv_nutritivne_vrijednosti`;
    const valueKey = `Meta: nutritivne_vrijednosti_${i}_broj_nutritivne_vrijednosti`;

    const name = row[nameKey];
    const value = row[valueKey];

    if (name && value) {
      values.push({ name, value });
    }
  }

  return values;
}

// Get or create category hierarchy
async function getOrCreateCategory(
  categoryPath: string,
  categoryCache: Map<string, mongoose.Types.ObjectId>
): Promise<mongoose.Types.ObjectId | null> {
  // Parse category path (e.g., "Med > Prirodni med")
  const parts = categoryPath
    .split(" > ")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  let parentId: mongoose.Types.ObjectId | null = null;
  let ancestors: mongoose.Types.ObjectId[] = [];
  let lastCategoryId: mongoose.Types.ObjectId | null = null;

  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];
    const slug = slugify(name);
    const cacheKey = parts.slice(0, i + 1).join(" > ");

    // Check cache first
    if (categoryCache.has(cacheKey)) {
      lastCategoryId = categoryCache.get(cacheKey)!;
      if (i < parts.length - 1) {
        parentId = lastCategoryId;
        ancestors.push(lastCategoryId);
      }
      continue;
    }

    // Check if category exists in database
    let category = await Category.findOne({ slug });

    if (!category) {
      // Create new category
      category = await Category.create({
        name,
        slug,
        parent: parentId,
        level: i + 1,
        ancestors: [...ancestors],
        isActive: true,
        order: 0,
      });
      console.log(`  ✓ Created category: ${name} (level ${i + 1})`);
    }

    // Cache the category
    categoryCache.set(cacheKey, category._id);
    lastCategoryId = category._id;

    if (i < parts.length - 1) {
      parentId = category._id;
      ancestors.push(category._id);
    }
  }

  return lastCategoryId;
}

// Parse CSV file
function parseCSV(filePath: string): WooCommerceRow[] {
  const content = fs.readFileSync(filePath, "utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    quote: '"',
    escape: '"',
  });

  return (records as Record<string, any>[]).map((row) => {
    const mapped: Record<string, any> = {};

    // Map columns
    for (const [bosnian, english] of Object.entries(COLUMN_MAP)) {
      if (row[bosnian] !== undefined) {
        mapped[english] = row[bosnian];
      }
    }

    // Parse nutritional values from meta fields
    mapped.nutritionalValues = parseNutritionalValues(row);

    // Keep all meta fields for potential future use
    for (const key of Object.keys(row)) {
      if (key.startsWith("Meta:") && !mapped[key]) {
        mapped[key] = row[key];
      }
    }

    return mapped as WooCommerceRow;
  });
}

// Main import function
async function importProducts(csvPath: string): Promise<ImportStats> {
  const stats: ImportStats = {
    categoriesCreated: 0,
    productsCreated: 0,
    productsUpdated: 0,
    variantsCreated: 0,
    imagesUploaded: 0,
    errors: [],
  };

  // Category cache to avoid duplicate lookups
  const categoryCache = new Map<string, mongoose.Types.ObjectId>();

  // Product cache for linking variations to parents
  const productCache = new Map<string, mongoose.Types.ObjectId>();

  console.log(`\n📦 Parsing CSV file: ${csvPath}`);
  const rows = parseCSV(csvPath);
  console.log(`  Found ${rows.length} rows\n`);

  // Separate variable products from variations
  const variableProducts = rows.filter((r) => r.type === "variable");
  const simpleProducts = rows.filter((r) => r.type === "simple");
  const variations = rows.filter((r) => r.type === "variation");

  console.log(`  📊 Variable products: ${variableProducts.length}`);
  console.log(`  📊 Simple products: ${simpleProducts.length}`);
  console.log(`  📊 Variations: ${variations.length}\n`);

  // Process variable products first (parents)
  console.log("🔄 Processing variable products...\n");

  for (const row of variableProducts) {
    try {
      console.log(`\n📦 Processing: ${row.name}`);

      // Get or create category
      let categoryId: mongoose.Types.ObjectId | null = null;
      if (row.categories) {
        // Take the most specific category (last one in comma-separated list)
        const categoryPaths = row.categories
          .split(",")
          .map((c: string) => c.trim());
        const mostSpecific = categoryPaths[categoryPaths.length - 1];
        categoryId = await getOrCreateCategory(mostSpecific, categoryCache);
      }

      if (!categoryId) {
        console.log(`  ⚠ No category found for product: ${row.name}`);
        // Create a default category
        categoryId = await getOrCreateCategory(
          "Nekategorizirano",
          categoryCache
        );
      }

      // Process images
      const images: IProductImage[] = [];
      if (row.images) {
        const imageUrls = row.images
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean);
        const productSlug = slugify(row.name);

        for (let i = 0; i < imageUrls.length; i++) {
          const gcsUrl = await uploadImageToGCS(imageUrls[i], productSlug, i);
          if (gcsUrl) {
            images.push({
              url: gcsUrl,
              alt: `${row.name} - slika ${i + 1}`,
              isPrimary: i === 0,
            });
            stats.imagesUploaded++;
          }
        }
      }

      // Find variations for this product
      const productVariations = variations.filter(
        (v) => v.parentSku === row.sku
      );
      const variants: IProductVariant[] = [];

      for (const variation of productVariations) {
        const variantPrice =
          parsePrice(variation.salePrice) || parsePrice(variation.regularPrice);

        // Upload variant image if different
        let variantImages: string[] = [];
        if (variation.images) {
          const variantImageUrls = variation.images
            .split(",")
            .map((url: string) => url.trim())
            .filter(Boolean);
          const variantSlug = slugify(variation.name);

          for (let i = 0; i < variantImageUrls.length; i++) {
            const gcsUrl = await uploadImageToGCS(
              variantImageUrls[i],
              variantSlug,
              i
            );
            if (gcsUrl) {
              variantImages.push(gcsUrl);
              stats.imagesUploaded++;
            }
          }
        }

        variants.push({
          id:
            variation.sku ||
            `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: variation.name,
          sku: variation.sku,
          price: variantPrice,
          stock: parseInt(variation.stock || "0", 10),
          attributes: variation.attribute1Name
            ? [
                {
                  key: variation.attribute1Name,
                  value: variation.attribute1Values || "",
                },
              ]
            : [],
          images: variantImages,
        });

        stats.variantsCreated++;
      }

      // Get base price from first variant or default
      const basePrice = variants[0]?.price || 0;

      // Create or update product
      const slug = slugify(row.name);
      const existingProduct = await Product.findOne({ slug });

      // Handle empty description - use name as fallback
      const description =
        row.description || row.shortDescription || row.name || "Bez opisa";

      // Handle empty SKU - only set if not empty
      const sku = row.sku && row.sku.trim() ? row.sku.trim() : undefined;

      const productData = {
        name: row.name,
        slug,
        description,
        shortDescription: row.shortDescription,
        price: basePrice,
        compareAtPrice:
          parsePrice(row.regularPrice) > basePrice
            ? parsePrice(row.regularPrice)
            : undefined,
        saleStartDate: row.saleStartDate
          ? new Date(row.saleStartDate)
          : undefined,
        saleEndDate: row.saleEndDate ? new Date(row.saleEndDate) : undefined,
        category: categoryId,
        tags: row.tags
          ? row.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
        brand: row.brand || undefined,
        images,
        sku,
        barcode: row.barcode || undefined,
        stock: variants.reduce((sum, v) => sum + v.stock, 0),
        trackInventory: true,
        lowStockThreshold: parseInt(row.lowStockThreshold || "5", 10),
        allowBackorder: parseBoolean(row.allowBackorder),
        taxStatus: (row.taxStatus || "taxable") as
          | "taxable"
          | "shipping"
          | "none",
        taxClass: row.taxClass || undefined,
        nutritionalValues: row.nutritionalValues || [],
        isActive: parseBoolean(row.published),
        isFeatured: parseBoolean(row.featured),
        weight: row.weight ? parseFloat(row.weight) : undefined,
        dimensions:
          row.length || row.width || row.height
            ? {
                length: parseFloat(row.length || "0"),
                width: parseFloat(row.width || "0"),
                height: parseFloat(row.height || "0"),
              }
            : undefined,
        variants,
        hasVariants: variants.length > 0,
      };

      if (existingProduct) {
        await Product.findByIdAndUpdate(existingProduct._id, productData);
        productCache.set(row.sku, existingProduct._id);
        stats.productsUpdated++;
        console.log(`  ✓ Updated product: ${row.name}`);
      } else {
        const newProduct = await Product.create(productData);
        productCache.set(row.sku, newProduct._id);
        stats.productsCreated++;
        console.log(`  ✓ Created product: ${row.name}`);
      }
    } catch (error: any) {
      const errorMsg = `Failed to import product "${row.name}": ${error.message}`;
      console.log(`  ✗ ${errorMsg}`);
      stats.errors.push(errorMsg);
    }
  }

  // Process simple products
  console.log("\n🔄 Processing simple products...\n");

  for (const row of simpleProducts) {
    try {
      console.log(`\n📦 Processing: ${row.name}`);

      // Get or create category
      let categoryId: mongoose.Types.ObjectId | null = null;
      if (row.categories) {
        const categoryPaths = row.categories
          .split(",")
          .map((c: string) => c.trim());
        const mostSpecific = categoryPaths[categoryPaths.length - 1];
        categoryId = await getOrCreateCategory(mostSpecific, categoryCache);
      }

      if (!categoryId) {
        categoryId = await getOrCreateCategory(
          "Nekategorizirano",
          categoryCache
        );
      }

      // Process images
      const images: IProductImage[] = [];
      if (row.images) {
        const imageUrls = row.images
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean);
        const productSlug = slugify(row.name);

        for (let i = 0; i < imageUrls.length; i++) {
          const gcsUrl = await uploadImageToGCS(imageUrls[i], productSlug, i);
          if (gcsUrl) {
            images.push({
              url: gcsUrl,
              alt: `${row.name} - slika ${i + 1}`,
              isPrimary: i === 0,
            });
            stats.imagesUploaded++;
          }
        }
      }

      const price = parsePrice(row.salePrice) || parsePrice(row.regularPrice);
      const slug = slugify(row.name);
      const existingProduct = await Product.findOne({ slug });

      // Handle empty description - use name as fallback
      const description =
        row.description || row.shortDescription || row.name || "Bez opisa";

      // Handle empty SKU - only set if not empty
      const sku = row.sku && row.sku.trim() ? row.sku.trim() : undefined;

      const productData = {
        name: row.name,
        slug,
        description,
        shortDescription: row.shortDescription,
        price,
        compareAtPrice:
          parsePrice(row.regularPrice) > price
            ? parsePrice(row.regularPrice)
            : undefined,
        saleStartDate: row.saleStartDate
          ? new Date(row.saleStartDate)
          : undefined,
        saleEndDate: row.saleEndDate ? new Date(row.saleEndDate) : undefined,
        category: categoryId,
        tags: row.tags
          ? row.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
        brand: row.brand || undefined,
        images,
        sku,
        barcode: row.barcode || undefined,
        stock: parseInt(row.stock || "0", 10),
        trackInventory: true,
        lowStockThreshold: parseInt(row.lowStockThreshold || "5", 10),
        allowBackorder: parseBoolean(row.allowBackorder),
        taxStatus: (row.taxStatus || "taxable") as
          | "taxable"
          | "shipping"
          | "none",
        taxClass: row.taxClass || undefined,
        nutritionalValues: row.nutritionalValues || [],
        isActive: parseBoolean(row.published),
        isFeatured: parseBoolean(row.featured),
        weight: row.weight ? parseFloat(row.weight) : undefined,
        dimensions:
          row.length || row.width || row.height
            ? {
                length: parseFloat(row.length || "0"),
                width: parseFloat(row.width || "0"),
                height: parseFloat(row.height || "0"),
              }
            : undefined,
        variants: [],
        hasVariants: false,
      };

      if (existingProduct) {
        await Product.findByIdAndUpdate(existingProduct._id, productData);
        stats.productsUpdated++;
        console.log(`  ✓ Updated product: ${row.name}`);
      } else {
        await Product.create(productData);
        stats.productsCreated++;
        console.log(`  ✓ Created product: ${row.name}`);
      }
    } catch (error: any) {
      const errorMsg = `Failed to import product "${row.name}": ${error.message}`;
      console.log(`  ✗ ${errorMsg}`);
      stats.errors.push(errorMsg);
    }
  }

  return stats;
}

// Main entry point
async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error(
      "❌ Usage: npx ts-node scripts/import-woocommerce.ts <csv-file-path>"
    );
    console.error(
      "   Example: npx ts-node scripts/import-woocommerce.ts wordpress-woocomerce-med.csv"
    );
    process.exit(1);
  }

  const fullPath = path.resolve(csvPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    process.exit(1);
  }

  // Connect to MongoDB
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/maksuz";
  console.log("🔌 Connecting to MongoDB...");

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  console.log("═".repeat(60));
  console.log("🚀 WooCommerce Import Script");
  console.log("═".repeat(60));

  try {
    const stats = await importProducts(fullPath);

    console.log("\n" + "═".repeat(60));
    console.log("📊 Import Summary");
    console.log("═".repeat(60));
    console.log(`  ✓ Categories created: ${stats.categoriesCreated}`);
    console.log(`  ✓ Products created: ${stats.productsCreated}`);
    console.log(`  ✓ Products updated: ${stats.productsUpdated}`);
    console.log(`  ✓ Variants created: ${stats.variantsCreated}`);
    console.log(`  ✓ Images uploaded: ${stats.imagesUploaded}`);

    if (stats.errors.length > 0) {
      console.log(`\n  ⚠ Errors: ${stats.errors.length}`);
      for (const error of stats.errors.slice(0, 10)) {
        console.log(`    - ${error}`);
      }
      if (stats.errors.length > 10) {
        console.log(`    ... and ${stats.errors.length - 10} more errors`);
      }
    }

    console.log("\n✅ Import completed!");
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

main();
