import { Router } from 'express';
import { careerController } from '../controllers';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// ============ PUBLIC ROUTES ============

// Get all active careers (public)
router.get('/', careerController.getAll);

// Get featured careers
router.get('/featured', careerController.getFeatured);

// Get unique departments
router.get('/departments', careerController.getDepartments);

// Get unique locations
router.get('/locations', careerController.getLocations);

// Get single career by slug (public)
router.get('/:slug', careerController.getBySlug);

// ============ ADMIN ROUTES ============

// Get all careers (admin - includes inactive)
router.get('/admin/all', authenticate, requireAdmin, careerController.getAllAdmin);

// Get single career by ID (admin)
router.get('/admin/:id', authenticate, requireAdmin, careerController.getByIdAdmin);

// Create new career
router.post('/', authenticate, requireAdmin, careerController.create);

// Update career
router.put('/:id', authenticate, requireAdmin, careerController.update);

// Toggle active status
router.patch('/:id/toggle-active', authenticate, requireAdmin, careerController.toggleActive);

// Toggle featured status
router.patch('/:id/toggle-featured', authenticate, requireAdmin, careerController.toggleFeatured);

// Delete career
router.delete('/:id', authenticate, requireAdmin, careerController.delete);

export const careerRoutes = router;
