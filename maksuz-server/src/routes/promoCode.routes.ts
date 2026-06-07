import { Router } from 'express';
import { promoCodeController } from '../controllers';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// Public routes
router.post('/validate', promoCodeController.validate);

// Admin routes
router.post('/', authenticate, requireAdmin, promoCodeController.create);
router.get('/', authenticate, requireAdmin, promoCodeController.getAll);
router.get('/:id', authenticate, requireAdmin, promoCodeController.getById);
router.get('/:id/orders', authenticate, requireAdmin, promoCodeController.getByIdWithOrders);
router.put('/:id', authenticate, requireAdmin, promoCodeController.update);
router.patch('/:id/toggle', authenticate, requireAdmin, promoCodeController.toggleActive);
router.delete('/:id', authenticate, requireAdmin, promoCodeController.delete);

export const promoCodeRoutes = router;

