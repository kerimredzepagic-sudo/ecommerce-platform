import { Router } from 'express';
import { customerController } from '../controllers';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// Admin routes only
router.get('/', authenticate, requireAdmin, customerController.getAll);
router.get('/:email', authenticate, requireAdmin, customerController.getByEmail);

export const customerRoutes = router;

