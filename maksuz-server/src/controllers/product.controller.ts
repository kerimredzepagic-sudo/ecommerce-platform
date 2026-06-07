import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { productService } from '../services';
import { toProductDTO, toProductListDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendError, sendPaginated, sendNotFound } from '../utils';

class ProductController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      sendCreated(res, toProductDTO(product), 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = '1',
        limit = '12',
        category,
        line,
        search,
        minPrice,
        maxPrice,
        inStock,
        isFeatured,
        isActive,
        sortBy,
        sortOrder,
      } = req.query;

      const { products, total } = await productService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        category: category as string,
        line: line as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock: inStock === 'true',
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        sortBy: sortBy as 'price' | 'name' | 'createdAt',
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      sendPaginated(
        res,
        toProductListDTOs(products),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if id is a valid MongoDB ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
      
      let product: Awaited<ReturnType<typeof productService.getById>> | null = null;
      
      // Try to find by ID first if it's a valid ObjectId, otherwise try slug
      if (isValidObjectId) {
        product = await productService.getById(id);
      }
      
      // If not found by ID (or id was not a valid ObjectId), try by slug
      if (!product) {
        product = await productService.getBySlug(id);
      }

      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }

      sendSuccess(res, toProductDTO(product));
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '8' } = req.query;
      const products = await productService.getFeatured(parseInt(limit as string, 10));
      sendSuccess(res, toProductListDTOs(products));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await productService.update(id, req.body);

      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }

      sendSuccess(res, toProductDTO(product), 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await productService.delete(id);

      if (!deleted) {
        sendNotFound(res, 'Product not found');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, line, search, inStock, isActive } = req.query;

      const { products } = await productService.getAll({
        page: 1,
        limit: 100000,
        category: category as string,
        line: line as string,
        search: search as string,
        inStock: inStock === 'true',
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      const lineLabels: Record<string, string> = {
        originals: 'Originals',
        premium: 'Premium',
        health: 'Health',
        energy: 'Energy',
      };

      const escapeCSV = (val: string) => {
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const headers = [
        'Naziv', 'Slug', 'Kratak opis', 'SKU', 'Barkod',
        'Cijena (KM)', 'Stara cijena (KM)', 'Na akciji',
        'Zaliha', 'Prati zalihu', 'Min. zaliha', 'Dozvoli backorder',
        'Kategorija', 'Linija', 'Brand', 'Tagovi',
        'Status', 'Istaknuto',
        'Tezina (g)', 'Duzina (cm)', 'Sirina (cm)', 'Visina (cm)',
        'Porezni status', 'Porezna klasa',
        'Slike', 'Link na shop',
        'Meta naslov', 'Meta opis',
        'Kreirano', 'Azurirano',
      ];
      const rows = products.map((p) => {
        const cat = p.category as unknown as { name: string; slug: string } | null;
        const imageUrls = p.images.map(img => img.url).join(' | ');

        return [
          escapeCSV(p.name),
          p.slug,
          escapeCSV(p.shortDescription || ''),
          p.sku || '',
          p.barcode || '',
          p.price.toFixed(2),
          p.compareAtPrice ? p.compareAtPrice.toFixed(2) : '',
          (p as any).isOnSale ? 'Da' : 'Ne',
          String(p.stock),
          p.trackInventory ? 'Da' : 'Ne',
          String(p.lowStockThreshold),
          p.allowBackorder ? 'Da' : 'Ne',
          cat?.name || '',
          p.line ? (lineLabels[p.line] || p.line) : '',
          p.brand || '',
          escapeCSV(p.tags.join('; ')),
          p.isActive ? 'Aktivan' : 'Neaktivan',
          p.isFeatured ? 'Da' : 'Ne',
          p.weight != null ? String(p.weight) : '',
          p.dimensions?.length != null ? String(p.dimensions.length) : '',
          p.dimensions?.width != null ? String(p.dimensions.width) : '',
          p.dimensions?.height != null ? String(p.dimensions.height) : '',
          p.taxStatus || '',
          p.taxClass || '',
          escapeCSV(imageUrls),
          `/shop/product/${p.slug}`,
          escapeCSV(p.metaTitle || ''),
          escapeCSV(p.metaDescription || ''),
          p.createdAt.toISOString().slice(0, 10),
          p.updatedAt.toISOString().slice(0, 10),
        ].join(',');
      });

      const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="proizvodi_${new Date().toISOString().slice(0, 10)}.csv"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const product = await productService.updateStock(id, quantity);

      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }

      sendSuccess(res, toProductDTO(product), 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();

