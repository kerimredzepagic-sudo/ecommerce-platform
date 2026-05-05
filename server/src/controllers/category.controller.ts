import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services';
import { toCategoryDTO, toCategoryDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendNotFound, sendError } from '../utils';

class CategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.body);
      sendCreated(res, toCategoryDTO(category), 'Category created successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum 3 levels')) {
        sendError(res, 'Cannot create category: maximum 3 levels allowed', 400);
        return;
      }
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) { next(error); }
  }

  async getTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await categoryService.getTree();
      sendSuccess(res, tree);
    } catch (error) { next(error); }
  }

  async getFlattenedList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await categoryService.getFlattenedList();
      sendSuccess(res, list);
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let category = await categoryService.getById(id);
      if (!category) { category = await categoryService.getBySlug(id); }
      if (!category) { sendNotFound(res, 'Category not found'); return; }
      sendSuccess(res, toCategoryDTO(category));
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.update(id, req.body);
      if (!category) { sendNotFound(res, 'Category not found'); return; }
      sendSuccess(res, toCategoryDTO(category), 'Category updated successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum 3 levels')) {
        sendError(res, 'Cannot move category: maximum 3 levels allowed', 400);
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await categoryService.delete(id);
      if (!deleted) { sendNotFound(res, 'Category not found'); return; }
      sendNoContent(res);
    } catch (error) {
      if (error instanceof Error && error.message.includes('subcategories')) {
        sendError(res, error.message, 400);
        return;
      }
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
