import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middleware';
import { validateBody } from '../middleware';
import { registerSchema, loginSchema, refreshTokenSchema, updateProfileSchema } from '../validators';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshTokenSchema), authController.refresh);
router.post('/verify-email', authController.verifyEmail);
router.post('/google', authController.googleAuth);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

export const authRoutes = router;
