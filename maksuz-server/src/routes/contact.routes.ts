import { Router } from 'express';
import { contactController } from '../controllers';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { createContactSchema, updateContactStatusSchema } from '../validators';

const router = Router();

// Public route
router.post('/', validateBody(createContactSchema), contactController.create);

// Admin routes
router.get('/', authenticate, requireAdmin, contactController.getAll);
router.get('/new-count', authenticate, requireAdmin, contactController.getNewCount);
router.get('/:id', authenticate, requireAdmin, contactController.getById);
router.patch('/:id/status', authenticate, requireAdmin, validateBody(updateContactStatusSchema), contactController.updateStatus);
router.delete('/:id', authenticate, requireAdmin, contactController.delete);

export const contactRoutes = router;

