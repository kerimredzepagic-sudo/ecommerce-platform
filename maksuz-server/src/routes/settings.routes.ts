import { Router } from 'express';
import { settingsController } from '../controllers';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// Public routes
router.get('/shipping', settingsController.getShippingSettings);

// Admin routes
router.put('/shipping', authenticate, requireAdmin, settingsController.updateShippingSettings);

export const settingsRoutes = router;

