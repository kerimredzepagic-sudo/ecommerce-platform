import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services';
import { toCategoryDTO, toCategoryDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendNotFound, sendError } from '../utils';

class CategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.body);
      sendCreated(res, toCategoryDTO(category), 'Kategorija uspješno kreirana');
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum 3 levels')) {
        sendError(res, 'Nije moguće kreirati kategoriju: maksimalno 3 nivoa dozvoljeno', 400);
        return;
      }
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await categoryService.getTree();
      sendSuccess(res, tree);
    } catch (error) {
      next(error);
    }
  }

  async getFlattenedList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await categoryService.getFlattenedList();
      sendSuccess(res, list);
    } catch (error) {
      next(error);
    }
  }

  async getTopLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getTopLevel();
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getByLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const level = parseInt(req.params.level, 10);
      if (isNaN(level) || level < 1 || level > 3) {
        sendError(res, 'Nivo mora biti između 1 i 3', 400);
        return;
      }
      const categories = await categoryService.getByLevel(level);
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Try to find by ID first, then by slug
      let category = await categoryService.getById(id);
      if (!category) {
        category = await categoryService.getBySlug(id);
      }

      if (!category) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendSuccess(res, toCategoryDTO(category));
    } catch (error) {
      next(error);
    }
  }

  async getChildren(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const categories = await categoryService.getChildren(id);
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getDescendants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const categories = await categoryService.getDescendants(id);
      sendSuccess(res, toCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await categoryService.update(id, req.body);

      if (!category) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendSuccess(res, toCategoryDTO(category), 'Kategorija uspješno ažurirana');
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum 3 levels')) {
        sendError(res, 'Nije moguće premjestiti kategoriju: maksimalno 3 nivoa dozvoljeno', 400);
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await categoryService.delete(id);

      if (!deleted) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      if (error instanceof Error && error.message.includes('podkategorije')) {
        sendError(res, error.message, 400);
        return;
      }
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderedIds } = req.body;

      if (!Array.isArray(orderedIds)) {
        sendError(res, 'orderedIds mora biti niz', 400);
        return;
      }

      await categoryService.reorder(orderedIds);
      sendSuccess(res, null, 'Redoslijed uspješno ažuriran');
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
