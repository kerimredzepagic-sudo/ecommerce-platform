import mongoose from 'mongoose';
import { Category, ICategory } from '../models';
import { slugify, generateUniqueSlug } from '../utils';

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  parent?: string;
  order?: number;
}

class CategoryService {
  async create(input: CreateCategoryInput): Promise<ICategory> {
    let slug = slugify(input.name);

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      slug = generateUniqueSlug(slug);
    }

    let level = 1;
    let ancestors: string[] = [];

    if (input.parent) {
      const parentCategory = await Category.findById(input.parent);
      if (parentCategory) {
        level = parentCategory.level + 1;
        if (level > 3) {
          throw new Error('Cannot create category: maximum 3 levels allowed');
        }
        ancestors = [...parentCategory.ancestors.map(a => a.toString()), parentCategory._id.toString()];
      }
    }

    const category = await Category.create({
      ...input,
      slug,
      level,
      ancestors,
    });

    return category;
  }

  async getById(id: string): Promise<ICategory | null> {
    return Category.findById(id)
      .populate('parent', 'name slug level')
      .populate('ancestors', 'name slug level');
  }

  async getBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug, isActive: true })
      .populate('parent', 'name slug level')
      .populate('ancestors', 'name slug level');
  }

  async getAll(): Promise<ICategory[]> {
    return Category.find()
      .populate('parent', 'name slug level')
      .sort({ level: 1, order: 1, name: 1 });
  }

  async getTree(): Promise<any[]> {
    const categories = await Category.find()
      .populate('parent', 'name slug')
      .sort({ level: 1, order: 1, name: 1 });

    const categoryMap = new Map<string, any>();

    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), {
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        level: cat.level,
        order: cat.order,
        isActive: cat.isActive,
        children: [],
      });
    });

    const tree: any[] = [];

    categories.forEach(cat => {
      const node = categoryMap.get(cat._id.toString());
      if (!node) return;

      if (cat.parent) {
        const parentId = (cat.parent as any)._id?.toString() || cat.parent.toString();
        const parentNode = categoryMap.get(parentId);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  async getFlattenedList(): Promise<{ id: string; name: string; level: number; fullPath: string }[]> {
    const categories = await Category.find({ isActive: true })
      .populate('ancestors', 'name')
      .sort({ level: 1, order: 1, name: 1 });

    return categories.map(cat => {
      const ancestorNames = cat.ancestors
        .map((a: any) => a.name)
        .join(' > ');

      return {
        id: cat._id.toString(),
        name: cat.name,
        level: cat.level,
        fullPath: ancestorNames ? `${ancestorNames} > ${cat.name}` : cat.name,
      };
    });
  }

  async update(id: string, updates: Partial<CreateCategoryInput>): Promise<ICategory | null> {
    if (updates.name) {
      const slug = slugify(updates.name);
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        (updates as Record<string, unknown>).slug = generateUniqueSlug(slug);
      } else {
        (updates as Record<string, unknown>).slug = slug;
      }
    }

    return Category.findByIdAndUpdate(id, updates, { new: true })
      .populate('parent', 'name slug level');
  }

  async delete(id: string): Promise<boolean> {
    const children = await Category.countDocuments({ parent: id });
    if (children > 0) {
      throw new Error('Cannot delete category that has subcategories');
    }

    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }
}

export const categoryService = new CategoryService();
