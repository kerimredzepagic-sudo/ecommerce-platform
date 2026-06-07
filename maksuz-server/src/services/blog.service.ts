import mongoose from 'mongoose';
import { BlogPost, IBlogPost, BlogCategory, IBlogCategory } from '../models';
import { slugify, generateUniqueSlug } from '../utils';

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  
  // Publishing
  isPublished?: boolean;
  scheduledAt?: string;
  isFeatured?: boolean;
  allowComments?: boolean;
  
  // Related
  relatedPosts?: string[];
}

export interface BlogQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface CreateBlogCategoryInput {
  name: string;
  description?: string;
  image?: string;
  order?: number;
}

class BlogService {
  // ============ BLOG POSTS ============

  async create(authorId: string, input: CreateBlogPostInput): Promise<IBlogPost> {
    // Use provided slug or generate from title
    let slug = input.slug ? slugify(input.slug) : slugify(input.title);

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      slug = generateUniqueSlug(slug);
    }

    const blogPost = await BlogPost.create({
      ...input,
      slug,
      author: authorId,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      publishedAt: input.isPublished ? new Date() : undefined,
    });

    return blogPost.populate(['author', 'category']);
  }

  async getById(id: string): Promise<IBlogPost | null> {
    return BlogPost.findById(id)
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .populate('relatedPosts', 'title slug coverImage');
  }

  async getBySlug(slug: string): Promise<IBlogPost | null> {
    const post = await BlogPost.findOne({ slug, isPublished: true })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .populate('relatedPosts', 'title slug coverImage excerpt');

    if (post) {
      // Increment views
      post.views += 1;
      await post.save();
    }

    return post;
  }

  async getAll(query: BlogQuery): Promise<{ posts: IBlogPost[]; total: number }> {
    const { page = 1, limit = 10, category, tag, search, isPublished, isFeatured } = query;

    const filter: Record<string, unknown> = {};

    if (isPublished !== undefined) {
      filter.isPublished = isPublished;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (category) {
      // Category can be either ObjectId or slug
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        // If it's not a valid ObjectId, try to find by slug
        const cat = await BlogCategory.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        }
      }
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      // Use regex search as fallback since $text requires an index
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('author', 'firstName lastName')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogPost.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async getFeatured(limit = 5): Promise<IBlogPost[]> {
    return BlogPost.find({ isPublished: true, isFeatured: true })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit);
  }

  async getRecent(limit = 5): Promise<IBlogPost[]> {
    return BlogPost.find({ isPublished: true })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit);
  }

  async getByCategory(categoryId: string, limit = 10): Promise<IBlogPost[]> {
    return BlogPost.find({ isPublished: true, category: categoryId })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit);
  }

  async getByTag(tag: string, limit = 10): Promise<IBlogPost[]> {
    return BlogPost.find({ isPublished: true, tags: tag })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit);
  }

  async getAllTags(): Promise<string[]> {
    const posts = await BlogPost.find({ isPublished: true }).select('tags');
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }

  async getScheduledPosts(): Promise<IBlogPost[]> {
    const now = new Date();
    return BlogPost.find({
      isPublished: false,
      scheduledAt: { $lte: now },
    });
  }

  async publishScheduledPosts(): Promise<number> {
    const posts = await this.getScheduledPosts();
    let published = 0;

    for (const post of posts) {
      post.isPublished = true;
      post.publishedAt = new Date();
      await post.save();
      published++;
    }

    return published;
  }

  async update(id: string, updates: Partial<CreateBlogPostInput>): Promise<IBlogPost | null> {
    const updateData: Record<string, unknown> = { ...updates };

    if (updates.title) {
      const slug = slugify(updates.title);
      const existingPost = await BlogPost.findOne({ slug, _id: { $ne: id } });
      if (existingPost) {
        updateData.slug = generateUniqueSlug(slug);
      } else {
        updateData.slug = slug;
      }
    }

    // Handle scheduling
    if (updates.scheduledAt) {
      updateData.scheduledAt = new Date(updates.scheduledAt);
    }

    // Handle publishing
    if (updates.isPublished === true) {
      const post = await BlogPost.findById(id);
      if (post && !post.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    return BlogPost.findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'firstName lastName')
      .populate('category', 'name slug');
  }

  async delete(id: string): Promise<boolean> {
    const result = await BlogPost.findByIdAndDelete(id);
    return !!result;
  }

  // ============ BLOG CATEGORIES ============

  async createCategory(input: CreateBlogCategoryInput): Promise<IBlogCategory> {
    let slug = slugify(input.name);

    const existingCategory = await BlogCategory.findOne({ slug });
    if (existingCategory) {
      slug = generateUniqueSlug(slug);
    }

    return BlogCategory.create({
      ...input,
      slug,
    });
  }

  async getCategoryById(id: string): Promise<IBlogCategory | null> {
    return BlogCategory.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<IBlogCategory | null> {
    return BlogCategory.findOne({ slug, isActive: true });
  }

  async getAllCategories(): Promise<IBlogCategory[]> {
    return BlogCategory.find().sort({ order: 1, name: 1 });
  }

  async getActiveCategories(): Promise<IBlogCategory[]> {
    return BlogCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
  }

  async updateCategory(id: string, updates: Partial<CreateBlogCategoryInput>): Promise<IBlogCategory | null> {
    const updateData: Record<string, unknown> = { ...updates };

    if (updates.name) {
      const slug = slugify(updates.name);
      const existingCategory = await BlogCategory.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        updateData.slug = generateUniqueSlug(slug);
      } else {
        updateData.slug = slug;
      }
    }

    return BlogCategory.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Check if category has posts
    const postsCount = await BlogPost.countDocuments({ category: id });
    if (postsCount > 0) {
      throw new Error('Ne možete obrisati kategoriju koja sadrži članke');
    }

    const result = await BlogCategory.findByIdAndDelete(id);
    return !!result;
  }

  async getCategoryPostCount(categoryId: string): Promise<number> {
    return BlogPost.countDocuments({ category: categoryId, isPublished: true });
  }
}

export const blogService = new BlogService();
