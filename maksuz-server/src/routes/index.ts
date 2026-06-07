import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { categoryRoutes } from './category.routes';
import { orderRoutes } from './order.routes';
import { blogRoutes } from './blog.routes';
import { contactRoutes } from './contact.routes';
import uploadRoutes from './upload.routes';
import slideRoutes from './slide.routes';
import { settingsRoutes } from './settings.routes';
import { promoCodeRoutes } from './promoCode.routes';
import { customerRoutes } from './customer.routes';
import { careerRoutes } from './career.routes';
import locationRoutes from './location.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Maksuz API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/slides', slideRoutes);
router.use('/settings', settingsRoutes);
router.use('/promo-codes', promoCodeRoutes);
router.use('/customers', customerRoutes);
router.use('/careers', careerRoutes);
router.use('/locations', locationRoutes);

export { router as apiRoutes };
