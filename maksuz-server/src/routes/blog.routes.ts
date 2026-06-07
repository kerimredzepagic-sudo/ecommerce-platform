import { Router } from 'express';
import { blogController } from '../controllers';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { createBlogPostSchema, updateBlogPostSchema, createBlogCategorySchema, updateBlogCategorySchema } from '../validators';

const router = Router();

// ============ PUBLIC ROUTES ============

// Categories
router.get('/categories', blogController.getActiveCategories);

// Posts
router.get('/', blogController.getAll);
router.get('/featured', blogController.getFeatured);
router.get('/recent', blogController.getRecent);
router.get('/tags', blogController.getTags);
router.get('/:slug', blogController.getBySlug);

// ============ ADMIN ROUTES ============

// Category management
router.get('/admin/categories', authenticate, requireAdmin, blogController.getAllCategories);
router.get('/admin/categories/:id', authenticate, requireAdmin, blogController.getCategoryById);
router.post('/admin/categories', authenticate, requireAdmin, validateBody(createBlogCategorySchema), blogController.createCategory);
router.put('/admin/categories/:id', authenticate, requireAdmin, validateBody(updateBlogCategorySchema), blogController.updateCategory);
router.delete('/admin/categories/:id', authenticate, requireAdmin, blogController.deleteCategory);

// Post management
router.get('/admin/all', authenticate, requireAdmin, blogController.getAllAdmin);
router.get('/admin/:id', authenticate, requireAdmin, blogController.getById);
router.post('/', authenticate, requireAdmin, validateBody(createBlogPostSchema), blogController.create);
router.put('/:id', authenticate, requireAdmin, validateBody(updateBlogPostSchema), blogController.update);
router.delete('/:id', authenticate, requireAdmin, blogController.delete);

export const blogRoutes = router;
