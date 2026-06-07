import { Request, Response, NextFunction } from 'express';
import { authService, passwordResetService } from '../services';
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

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      sendCreated(
        res,
        { email: result.email, requiresVerification: true },
        result.message
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      sendSuccess(
        res,
        toAuthResponseDTO(result.user, result.accessToken, result.refreshToken),
        'Login successful'
      );
    } catch (error) {
      // Handle unverified account error specially
      if (error instanceof UnverifiedAccountError) {
        res.status(403).json({
          success: false,
          error: error.message,
          code: 'UNVERIFIED_ACCOUNT',
          email: error.email,
        });
        return;
      }
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        sendError(res, 'Verifikacijski token je obavezan', 400);
        return;
      }

      const result = await authService.verifyEmail(token);

      if (result.success) {
        sendSuccess(res, { verified: true }, result.message);
      } else {
        sendError(res, result.message, 400);
      }
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        sendError(res, 'Email je obavezan', 400);
        return;
      }

      const result = await authService.resendVerificationEmail(email);

      if (result.success) {
        sendSuccess(res, { email }, result.message);
      } else {
        sendError(res, result.message, 400);
      }
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        sendError(res, 'Refresh token is required', 400);
        return;
      }

      const tokens = await authService.refreshTokens(refreshToken);

      sendSuccess(res, tokens, 'Tokens refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.userId) {
        await authService.logout(req.user.userId);
      }

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, toUserDTO(user));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { firstName, lastName, phone, address } = req.body;

      const user = await authService.updateUser(req.user.userId, {
        firstName,
        lastName,
        phone,
        address,
      });

      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, toUserDTO(user), 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        sendError(res, 'Email je obavezan', 400);
        return;
      }

      const result = await passwordResetService.requestReset(email);

      if (result.success) {
        sendSuccess(res, { email }, result.message);
      } else {
        sendError(res, result.message, 500);
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyResetCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        sendError(res, 'Email i kod su obavezni', 400);
        return;
      }

      const result = await passwordResetService.verifyCode(email, code);

      if (result.success) {
        sendSuccess(res, { token: result.token }, result.message);
      } else {
        sendError(res, result.message, 400);
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        sendError(res, 'Token i nova lozinka su obavezni', 400);
        return;
      }

      if (password.length < 6) {
        sendError(res, 'Lozinka mora imati najmanje 6 karaktera', 400);
        return;
      }

      const result = await passwordResetService.resetPassword(token, password);

      if (result.success) {
        sendSuccess(res, null, result.message);
      } else {
        sendError(res, result.message, 400);
      }
    } catch (error) {
      next(error);
    }
  }

  async resendCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        sendError(res, 'Email je obavezan', 400);
        return;
      }

      const result = await passwordResetService.resendCode(email);

      if (result.success) {
        sendSuccess(res, { email }, result.message);
      } else {
        sendError(res, result.message, 500);
      }
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { googleId, email, firstName, lastName, avatarUrl } = req.body;

      if (!googleId || !email) {
        sendError(res, 'Google ID i email su obavezni', 400);
        return;
      }

      const result = await authService.googleAuth({
        googleId,
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        avatarUrl,
      });

      sendSuccess(
        res,
        {
          ...toAuthResponseDTO(result.user, result.accessToken, result.refreshToken),
          isNewUser: result.isNewUser,
          profileCompleted: result.user.profileCompleted,
        },
        result.isNewUser ? 'Račun uspješno kreiran' : 'Prijava uspješna'
      );
    } catch (error) {
      next(error);
    }
  }

  async completeProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { phone } = req.body;

      const user = await authService.completeProfile(req.user.userId, { phone });

      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, toUserDTO(user), 'Profil uspješno dopunjen');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        sendError(res, 'Trenutna i nova lozinka su obavezne', 400);
        return;
      }

      if (newPassword.length < 6) {
        sendError(res, 'Nova lozinka mora imati najmanje 6 karaktera', 400);
        return;
      }

      const result = await authService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  async setPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { newPassword, confirmPassword } = req.body;

      if (!newPassword || !confirmPassword) {
        sendError(res, 'Nova lozinka i potvrda su obavezne', 400);
        return;
      }

      if (newPassword !== confirmPassword) {
        sendError(res, 'Lozinke se ne podudaraju', 400);
        return;
      }

      if (newPassword.length < 6) {
        sendError(res, 'Lozinka mora imati najmanje 6 karaktera', 400);
        return;
      }

      const result = await authService.setPassword(req.user.userId, newPassword);

      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  async hasPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const hasPassword = await authService.hasPassword(req.user.userId);

      sendSuccess(res, { hasPassword });
    } catch (error) {
      next(error);
    }
  }

  async requestEmailChange(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { newEmail, password } = req.body;

      if (!newEmail || !password) {
        sendError(res, 'Nova email adresa i lozinka su obavezni', 400);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        sendError(res, 'Nevažeći format email adrese', 400);
        return;
      }

      const result = await authService.requestEmailChange(req.user.userId, newEmail, password);

      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmailChange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        sendError(res, 'Token je obavezan', 400);
        return;
      }

      const result = await authService.verifyEmailChange(token);

      sendSuccess(res, { newEmail: result.newEmail }, result.message);
    } catch (error) {
      next(error);
    }
  }

  async getPendingEmailChange(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const result = await authService.getPendingEmailChange(req.user.userId);

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async cancelEmailChange(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const result = await authService.cancelEmailChange(req.user.userId);

      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
