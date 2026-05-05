import { Router } from 'express';
import { categoryController } from '../controllers';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { createCategorySchema, updateCategorySchema } from '../validators';

const router = Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/tree', categoryController.getTree);
router.get('/flat', categoryController.getFlattenedList);
router.get('/:id', categoryController.getById);

// Admin routes
router.post('/', authenticate, requireAdmin, validateBody(createCategorySchema), categoryController.create);
router.put('/:id', authenticate, requireAdmin, validateBody(updateCategorySchema), categoryController.update);
router.delete('/:id', authenticate, requireAdmin, categoryController.delete);

export const categoryRoutes = router;
