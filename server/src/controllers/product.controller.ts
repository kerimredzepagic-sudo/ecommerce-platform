import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { productService } from '../services';
import { toProductDTO, toProductListDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated, sendNotFound } from '../utils';

class ProductController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      sendCreated(res, toProductDTO(product), 'Product created successfully');
    } catch (error) { next(error); }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '12', category, search, minPrice, maxPrice, inStock, isFeatured, isActive, sortBy, sortOrder } = req.query;

      const { products, total } = await productService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        category: category as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock: inStock === 'true',
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        sortBy: sortBy as 'price' | 'name' | 'createdAt',
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      sendPaginated(res, toProductListDTOs(products), parseInt(page as string, 10), parseInt(limit as string, 10), total);
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

      let product: any = null;
      if (isValidObjectId) { product = await productService.getById(id); }
      if (!product) { product = await productService.getBySlug(id); }
      if (!product) { sendNotFound(res, 'Product not found'); return; }

      sendSuccess(res, toProductDTO(product));
    } catch (error) { next(error); }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '8' } = req.query;
      const products = await productService.getFeatured(parseInt(limit as string, 10));
      sendSuccess(res, toProductListDTOs(products));
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      if (!product) { sendNotFound(res, 'Product not found'); return; }
      sendSuccess(res, toProductDTO(product), 'Product updated successfully');
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await productService.delete(id);
      if (!deleted) { sendNotFound(res, 'Product not found'); return; }
      sendNoContent(res);
    } catch (error) { next(error); }
  }

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await productService.updateStock(id, quantity);
      if (!product) { sendNotFound(res, 'Product not found'); return; }
      sendSuccess(res, toProductDTO(product), 'Stock updated successfully');
    } catch (error) { next(error); }
  }
}

export const productController = new ProductController();
