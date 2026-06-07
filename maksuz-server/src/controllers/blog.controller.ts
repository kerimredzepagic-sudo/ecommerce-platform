import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services';
import { toBlogPostDTO, toBlogPostListDTOs, toBlogCategoryDTO, toBlogCategoryDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendError, sendPaginated, sendNotFound } from '../utils';
import { AuthenticatedRequest } from './auth.controller';

class BlogController {
  // ============ BLOG POSTS ============

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const post = await blogService.create(req.user.userId, req.body);
      sendCreated(res, toBlogPostDTO(post), 'Članak uspješno kreiran');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', category, tag, search } = req.query;

      const { posts, total } = await blogService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        category: category as string,
        tag: tag as string,
        search: search as string,
        isPublished: true,
      });

      sendPaginated(
        res,
        toBlogPostListDTOs(posts),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', category, tag, search, isPublished, isFeatured } = req.query;

      const { posts, total } = await blogService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        category: category as string,
        tag: tag as string,
        search: search as string,
        isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      });

      sendPaginated(
        res,
        toBlogPostListDTOs(posts),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const post = await blogService.getBySlug(slug);

      if (!post) {
        sendNotFound(res, 'Članak nije pronađen');
        return;
      }

      sendSuccess(res, toBlogPostDTO(post));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const post = await blogService.getById(id);

      if (!post) {
        sendNotFound(res, 'Članak nije pronađen');
        return;
      }

      sendSuccess(res, toBlogPostDTO(post));
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '5' } = req.query;
      const posts = await blogService.getFeatured(parseInt(limit as string, 10));
      sendSuccess(res, toBlogPostListDTOs(posts));
    } catch (error) {
      next(error);
    }
  }

  async getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '5' } = req.query;
      const posts = await blogService.getRecent(parseInt(limit as string, 10));
      sendSuccess(res, toBlogPostListDTOs(posts));
    } catch (error) {
      next(error);
    }
  }

  async getTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = await blogService.getAllTags();
      sendSuccess(res, tags);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const post = await blogService.update(id, req.body);

      if (!post) {
        sendNotFound(res, 'Članak nije pronađen');
        return;
      }

      sendSuccess(res, toBlogPostDTO(post), 'Članak uspješno ažuriran');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await blogService.delete(id);

      if (!deleted) {
        sendNotFound(res, 'Članak nije pronađen');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ============ BLOG CATEGORIES ============

  async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await blogService.createCategory(req.body);
      sendCreated(res, toBlogCategoryDTO(category), 'Kategorija uspješno kreirana');
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await blogService.getAllCategories();
      sendSuccess(res, toBlogCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getActiveCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await blogService.getActiveCategories();
      sendSuccess(res, toBlogCategoryDTOs(categories));
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await blogService.getCategoryById(id);

      if (!category) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendSuccess(res, toBlogCategoryDTO(category));
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await blogService.updateCategory(id, req.body);

      if (!category) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendSuccess(res, toBlogCategoryDTO(category), 'Kategorija uspješno ažurirana');
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await blogService.deleteCategory(id);

      if (!deleted) {
        sendNotFound(res, 'Kategorija nije pronađena');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      if (error instanceof Error && error.message.includes('članke')) {
        sendError(res, error.message, 400);
        return;
      }
      next(error);
    }
  }
}

export const blogController = new BlogController();
