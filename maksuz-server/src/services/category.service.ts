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

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  order: number;
  isActive: boolean;
  parent?: { id: string; name: string };
  children: CategoryTreeNode[];
}

class CategoryService {
  async create(input: CreateCategoryInput): Promise<ICategory> {
    let slug = slugify(input.name);

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      slug = generateUniqueSlug(slug);
    }

    // Calculate level and ancestors based on parent
    let level = 1;
    let ancestors: string[] = [];

    if (input.parent) {
      const parentCategory = await Category.findById(input.parent);
      if (parentCategory) {
        level = parentCategory.level + 1;
        
        // Max 3 levels
        if (level > 3) {
          throw new Error('Cannot create category: maximum 3 levels allowed');
        }
        
        // Build ancestors array
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

  async getActiveCategories(): Promise<ICategory[]> {
    return Category.find({ isActive: true })
      .populate('parent', 'name slug level')
      .sort({ level: 1, order: 1, name: 1 });
  }

  async getTopLevel(): Promise<ICategory[]> {
    return Category.find({ isActive: true, level: 1, parent: null })
      .sort({ order: 1, name: 1 });
  }

  async getByLevel(level: number): Promise<ICategory[]> {
    return Category.find({ isActive: true, level })
      .populate('parent', 'name slug level')
      .sort({ order: 1, name: 1 });
  }

  async getChildren(parentId: string): Promise<ICategory[]> {
    return Category.find({ isActive: true, parent: parentId })
      .sort({ order: 1, name: 1 });
  }

  async getDescendants(categoryId: string): Promise<ICategory[]> {
    return Category.find({ ancestors: categoryId, isActive: true })
      .sort({ level: 1, order: 1, name: 1 });
  }

  /**
   * Get all categories as a hierarchical tree structure
   */
  async getTree(): Promise<CategoryTreeNode[]> {
    const categories = await Category.find()
      .populate('parent', 'name slug')
      .sort({ level: 1, order: 1, name: 1 });

    // Build a map for quick lookup
    const categoryMap = new Map<string, CategoryTreeNode>();
    
    // First pass: create nodes
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
        parent: cat.parent ? {
          id: (cat.parent as any)._id?.toString() || cat.parent.toString(),
          name: (cat.parent as any).name || ''
        } : undefined,
        children: [],
      });
    });

    // Second pass: build tree
    const tree: CategoryTreeNode[] = [];
    
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

  /**
   * Get flattened list with indentation info for dropdowns
   */
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

    // If parent is being changed, update level and ancestors
    if (updates.parent !== undefined) {
      if (updates.parent) {
        const parentCategory = await Category.findById(updates.parent);
        if (parentCategory) {
          const newLevel = parentCategory.level + 1;
          
          if (newLevel > 3) {
            throw new Error('Cannot move category: maximum 3 levels allowed');
          }
          
          (updates as Record<string, unknown>).level = newLevel;
          (updates as Record<string, unknown>).ancestors = [
            ...parentCategory.ancestors.map(a => a.toString()),
            parentCategory._id.toString()
          ];
        }
      } else {
        // Moving to top level
        (updates as Record<string, unknown>).level = 1;
        (updates as Record<string, unknown>).ancestors = [];
      }

      // Update all descendants' ancestors
      const updatedCategory = await Category.findById(id);
      if (updatedCategory) {
        await this.updateDescendantsAncestors(id);
      }
    }

    return Category.findByIdAndUpdate(id, updates, { new: true })
      .populate('parent', 'name slug level');
  }

  private async updateDescendantsAncestors(categoryId: string): Promise<void> {
    const category = await Category.findById(categoryId);
    if (!category) return;

    const children = await Category.find({ parent: categoryId });
    
    for (const child of children) {
      const newAncestors = [...category.ancestors.map(a => a.toString()), categoryId];
      const newLevel = category.level + 1;

      await Category.findByIdAndUpdate(child._id, {
        ancestors: newAncestors,
        level: newLevel,
      });

      // Recursively update children's descendants
      await this.updateDescendantsAncestors(child._id.toString());
    }
  }

  async delete(id: string): Promise<boolean> {
    // Check if category has children
    const children = await Category.countDocuments({ parent: id });
    if (children > 0) {
      throw new Error('Ne možete obrisati kategoriju koja ima podkategorije');
    }

    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Reorder categories - update the order field for multiple categories
   * @param orderedIds Array of { id, order, parentId? } objects
   */
  async reorder(orderedIds: { id: string; order: number; parentId?: string | null }[]): Promise<void> {
    const bulkOps = orderedIds.map(({ id, order, parentId }) => {
      const update: Record<string, unknown> = { order };
      
      // If parentId is provided, we're also moving the category
      if (parentId !== undefined) {
        update.parent = parentId ? new mongoose.Types.ObjectId(parentId) : null;
      }
      
      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $set: update },
        },
      };
    });

    if (bulkOps.length > 0) {
      await Category.bulkWrite(bulkOps);
    }
  }
}

export const categoryService = new CategoryService();
