import { Router } from 'express';
import { productController } from '../controllers';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { createProductSchema, updateProductSchema, updateStockSchema } from '../validators';

const router = Router();

// Public routes
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/:id', productController.getById);

// Admin routes
router.get('/export/csv', authenticate, requireAdmin, productController.exportCSV);
router.post('/', authenticate, requireAdmin, validateBody(createProductSchema), productController.create);
router.put('/:id', authenticate, requireAdmin, validateBody(updateProductSchema), productController.update);
router.patch('/:id/stock', authenticate, requireAdmin, validateBody(updateStockSchema), productController.updateStock);
router.delete('/:id', authenticate, requireAdmin, productController.delete);

export const productRoutes = router;

