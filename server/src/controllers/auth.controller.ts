import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { UnverifiedAccountError } from '../services/auth.service';
import { toAuthResponseDTO, toUserDTO } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../utils';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      const result = await authService.register({ email, password, firstName, lastName, phone });
      sendCreated(res, { email: result.email, requiresVerification: true }, result.message);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      sendSuccess(res, toAuthResponseDTO(result.user, result.accessToken, result.refreshToken), 'Login successful');
    } catch (error) {
      if (error instanceof UnverifiedAccountError) {
        res.status(403).json({ success: false, error: error.message, code: 'UNVERIFIED_ACCOUNT', email: error.email });
        return;
      }
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) { sendError(res, 'Verification token is required', 400); return; }
      const result = await authService.verifyEmail(token);
      if (result.success) { sendSuccess(res, { verified: true }, result.message); }
      else { sendError(res, result.message, 400); }
    } catch (error) { next(error); }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) { sendError(res, 'Refresh token is required', 400); return; }
      const tokens = await authService.refreshTokens(refreshToken);
      sendSuccess(res, tokens, 'Tokens refreshed successfully');
    } catch (error) { next(error); }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.userId) { await authService.logout(req.user.userId); }
      sendNoContent(res);
    } catch (error) { next(error); }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) { sendError(res, 'Unauthorized', 401); return; }
      const user = await authService.getUserById(req.user.userId);
      if (!user) { sendError(res, 'User not found', 404); return; }
      sendSuccess(res, toUserDTO(user));
    } catch (error) { next(error); }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) { sendError(res, 'Unauthorized', 401); return; }
      const { firstName, lastName, phone, address } = req.body;
      const user = await authService.updateUser(req.user.userId, { firstName, lastName, phone, address });
      if (!user) { sendError(res, 'User not found', 404); return; }
      sendSuccess(res, toUserDTO(user), 'Profile updated successfully');
    } catch (error) { next(error); }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) { sendError(res, 'Unauthorized', 401); return; }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) { sendError(res, 'Current and new password are required', 400); return; }
      if (newPassword.length < 6) { sendError(res, 'New password must be at least 6 characters', 400); return; }
      const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
      sendSuccess(res, null, result.message);
    } catch (error) { next(error); }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { googleId, email, firstName, lastName, avatarUrl } = req.body;
      if (!googleId || !email) { sendError(res, 'Google ID and email are required', 400); return; }
      const result = await authService.googleAuth({ googleId, email, firstName: firstName || 'User', lastName: lastName || '', avatarUrl });
      sendSuccess(res, { ...toAuthResponseDTO(result.user, result.accessToken, result.refreshToken), isNewUser: result.isNewUser, profileCompleted: result.user.profileCompleted }, result.isNewUser ? 'Account created successfully' : 'Login successful');
    } catch (error) { next(error); }
  }
}

export const authController = new AuthController();
