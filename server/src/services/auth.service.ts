import crypto from 'crypto';
import { User, IUser } from '../models';
import { hashPassword, comparePassword, generateTokens, verifyRefreshToken, TokenPayload } from '../utils';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export class UnverifiedAccountError extends Error {
  email: string;
  constructor(email: string) {
    super('Account is not verified. Please check your email for the verification link.');
    this.name = 'UnverifiedAccountError';
    this.email = email;
  }
}

class AuthService {
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(input: RegisterInput): Promise<{ message: string; email: string }> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(input.password);
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      ...input,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    return {
      message: 'Account created. Please check your email for the verification link.',
      email: input.email.toLowerCase(),
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    if (!user.password) {
      throw new Error('Please use Google to sign in to this account');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified && user.role !== 'admin') {
      throw new UnverifiedAccountError(user.email);
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, ...tokens };
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired verification link.' };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { success: true, message: 'Email verified successfully. You can now log in.' };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password -refreshToken');
  }

  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    delete updates.password;
    delete updates.refreshToken;
    delete updates.role;

    return User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -refreshToken');
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.password) {
      throw new Error('This account uses Google sign-in. No password is set.');
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  }

  async googleAuth(input: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }): Promise<AuthResult & { isNewUser: boolean }> {
    let user = await User.findOne({ googleId: input.googleId });
    let isNewUser = false;

    if (!user) {
      user = await User.findOne({ email: input.email.toLowerCase() });

      if (user) {
        user.googleId = input.googleId;
        user.provider = 'google';
        if (!user.avatarUrl && input.avatarUrl) {
          user.avatarUrl = input.avatarUrl;
        }
        await user.save();
      } else {
        isNewUser = true;
        user = await User.create({
          email: input.email.toLowerCase(),
          firstName: input.firstName,
          lastName: input.lastName,
          googleId: input.googleId,
          provider: 'google',
          avatarUrl: input.avatarUrl,
          isVerified: true,
          isActive: true,
          profileCompleted: false,
        });
      }
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, isNewUser, ...tokens };
  }
}

export const authService = new AuthService();
