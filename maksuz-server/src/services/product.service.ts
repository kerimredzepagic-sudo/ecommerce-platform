import mongoose from 'mongoose';
import { Product, IProduct, Category } from '../models';
import { slugify, generateUniqueSlug } from '../utils';

export interface ProductImageInput {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariantInput {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
  attributes?: Array<{ key: string; value: string }>;
  images?: string[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  category?: string;
  line?: 'originals' | 'premium' | 'health' | 'energy' | null;
  images?: ProductImageInput[];
  sku?: string;
  stock?: number;
  trackInventory?: boolean;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants?: ProductVariantInput[];
  hasVariants?: boolean;
  tags?: string[];
  attributes?: Record<string, string>;
  nutritionalInfo?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  line?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isOnSale?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class ProductService {
  async create(input: CreateProductInput): Promise<IProduct> {
    let slug = slugify(input.name);

    // Check if slug exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      slug = generateUniqueSlug(slug);
    }

    const product = await Product.create({
      ...input,
      slug,
      attributes: input.attributes ? new Map(Object.entries(input.attributes)) : new Map(),
    });

    return product;
  }

  async getById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate('category', 'name slug');
  }

  async getBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug, isActive: true }).populate('category', 'name slug');
  }

  async getAll(query: ProductQuery): Promise<{ products: IProduct[]; total: number }> {
    const { page = 1, limit = 12, category, line, search, minPrice, maxPrice, inStock, isFeatured, isActive, isOnSale, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter: Record<string, unknown> = {};
    
    // Only filter by isActive if explicitly set
    // Admin pages won't pass this (show all), public pages should pass isActive=true
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    // Filter by product line (originals, premium, health, energy)
    if (line) {
      filter.line = line;
    }

    if (category) {
      // Find category by slug or id
      // Only include _id check if it's a valid ObjectId to avoid CastError
      const query: Record<string, unknown>[] = [{ slug: category }];
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.push({ _id: category });
      }
      
      const cat = await Category.findOne({ $or: query });
      if (cat) {
        // Find all subcategories (categories that have this category in ancestors)
        const subcategories = await Category.find({ ancestors: cat._id });
        const categoryIds = [cat._id, ...subcategories.map(sc => sc._id)];
        filter.category = { $in: categoryIds };
      }
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
      if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
    }

    if (inStock) {
      filter.$or = [{ stock: { $gt: 0 } }, { allowBackorder: true }];
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    // Filter for products on sale (compareAtPrice > price and within sale date range)
    if (isOnSale) {
      const now = new Date();
      filter.compareAtPrice = { $exists: true, $gt: 0 };
      filter.$expr = { $gt: ['$compareAtPrice', '$price'] };
      // Sale dates: either not set, or current date is within range
      filter.$and = [
        {
          $or: [
            { saleStartDate: { $exists: false } },
            { saleStartDate: null },
            { saleStartDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { saleEndDate: { $exists: false } },
            { saleEndDate: null },
            { saleEndDate: { $gte: now } }
          ]
        }
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return { products, total };
  }

  async getFeatured(limit = 8): Promise<IProduct[]> {
    return Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async update(id: string, updates: Partial<CreateProductInput>): Promise<IProduct | null> {
    if (updates.name) {
      const slug = slugify(updates.name);
      const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
      if (existingProduct) {
        (updates as Record<string, unknown>).slug = generateUniqueSlug(slug);
      } else {
        (updates as Record<string, unknown>).slug = slug;
      }
    }

    if (updates.attributes) {
      (updates as Record<string, unknown>).attributes = new Map(Object.entries(updates.attributes));
    }

    return Product.findByIdAndUpdate(id, updates, { new: true }).populate('category', 'name slug');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true });
  }
}

export const productService = new ProductService();

