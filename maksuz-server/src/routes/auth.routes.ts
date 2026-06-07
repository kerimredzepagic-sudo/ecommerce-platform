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

// Email verification routes (public)
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// Password reset routes (public)
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-code', authController.resendCode);

// Google OAuth (public)
router.post('/google', authController.googleAuth);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile);
router.post('/complete-profile', authenticate, authController.completeProfile);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/set-password', authenticate, authController.setPassword);
router.get('/has-password', authenticate, authController.hasPassword);

// Email change routes
router.post('/request-email-change', authenticate, authController.requestEmailChange);
router.post('/verify-email-change', authController.verifyEmailChange); // Public - accessed via email link
router.get('/pending-email-change', authenticate, authController.getPendingEmailChange);
router.delete('/cancel-email-change', authenticate, authController.cancelEmailChange);

export const authRoutes = router;

