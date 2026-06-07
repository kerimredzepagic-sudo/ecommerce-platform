import { Router } from 'express';
import { orderController } from '../controllers';
import { authenticate, requireAdmin, validateBody } from '../middleware';
import { createOrderSchema, createGuestOrderSchema, updateOrderStatusSchema, updatePaymentStatusSchema } from '../validators';

const router = Router();

// Public routes (no authentication required)
router.post('/guest', validateBody(createGuestOrderSchema), orderController.createGuestOrder);
router.get('/track/:orderNumber', orderController.trackOrder);

// User routes (protected)
router.post('/', authenticate, validateBody(createOrderSchema), orderController.create);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/my-stats', authenticate, orderController.getMyOrderStats);
router.get('/number/:orderNumber', authenticate, orderController.getByOrderNumber);
router.get('/:id', authenticate, orderController.getById);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, orderController.getAllOrders);
router.get('/admin/analytics', authenticate, requireAdmin, orderController.getAnalytics);
router.patch('/:id/status', authenticate, requireAdmin, validateBody(updateOrderStatusSchema), orderController.updateStatus);
router.patch('/:id/payment-status', authenticate, requireAdmin, validateBody(updatePaymentStatusSchema), orderController.updatePaymentStatus);
router.patch('/:id/tracking', authenticate, requireAdmin, orderController.updateTracking);

export const orderRoutes = router;

