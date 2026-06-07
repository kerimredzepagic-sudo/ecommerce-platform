import crypto from 'crypto';
import { User, IUser } from '../models';
import { EmailChangeRequest } from '../models/emailChangeRequest.model';
import { hashPassword, comparePassword, generateTokens, verifyRefreshToken, TokenPayload } from '../utils';
import { emailService } from './email.service';

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

// Custom error for unverified accounts
export class UnverifiedAccountError extends Error {
  email: string;
  constructor(email: string) {
    super('Račun nije verificiran. Provjerite email za verifikacijski link.');
    this.name = 'UnverifiedAccountError';
    this.email = email;
  }
}

class AuthService {
  /**
   * Generate a verification token
   */
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(input: RegisterInput): Promise<{ message: string; email: string }> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new Error('Korisnik sa ovim emailom već postoji');
    }

    const hashedPassword = await hashPassword(input.password);
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      ...input,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName
    );

    if (!emailSent) {
      // Delete user if email failed to send
      await User.deleteOne({ _id: user._id });
      throw new Error('Greška pri slanju verifikacijskog emaila. Pokušajte ponovo.');
    }

    return {
      message: 'Račun kreiran. Provjerite email za verifikacijski link.',
      email: user.email,
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new Error('Pogrešan email ili lozinka');
    }

    if (!user.isActive) {
      throw new Error('Račun je deaktiviran');
    }

    // Check if user has a password (Google users might not have one)
    if (!user.password) {
      throw new Error('Koristite Google za prijavu na ovaj račun');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Pogrešan email ili lozinka');
    }

    // Check if account is verified (admins are auto-verified)
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

    return {
      user,
      ...tokens,
    };
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return {
        success: false,
        message: 'Neispravan ili istekao verifikacijski link.',
      };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return {
      success: true,
      message: 'Email uspješno verificiran. Možete se prijaviti.',
    };
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'Ako postoji račun sa ovim emailom, poslaćemo verifikacijski link.',
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: 'Račun je već verificiran.',
      };
    }

    // Generate new token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send email
    const emailSent = await emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName
    );

    if (!emailSent) {
      return {
        success: false,
        message: 'Greška pri slanju emaila. Pokušajte ponovo.',
      };
    }

    return {
      success: true,
      message: 'Verifikacijski email je poslan.',
    };
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
    // Prevent updating sensitive fields
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
      throw new Error('Korisnik nije pronađen');
    }

    // For Google users without password
    if (!user.password) {
      throw new Error('Ovaj račun koristi Google prijavu. Lozinka nije postavljena.');
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Trenutna lozinka nije ispravna');
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return {
      success: true,
      message: 'Lozinka uspješno promijenjena',
    };
  }

  /**
   * Google OAuth authentication
   * Creates account if user doesn't exist, or logs in if they do
   */
  async googleAuth(input: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }): Promise<AuthResult & { isNewUser: boolean }> {
    // First, check if user exists with this Google ID
    let user = await User.findOne({ googleId: input.googleId });
    let isNewUser = false;

    if (!user) {
      // Check if user exists with this email (might have registered with email)
      user = await User.findOne({ email: input.email.toLowerCase() });

      if (user) {
        // User exists with email - link Google account to existing account
        user.googleId = input.googleId;
        user.provider = 'google';
        if (!user.avatarUrl && input.avatarUrl) {
          user.avatarUrl = input.avatarUrl;
        }
        await user.save();
      } else {
        // Create new user with Google
        isNewUser = true;
        user = await User.create({
          email: input.email.toLowerCase(),
          firstName: input.firstName,
          lastName: input.lastName,
          googleId: input.googleId,
          provider: 'google',
          avatarUrl: input.avatarUrl,
          isVerified: true, // Google accounts are auto-verified
          isActive: true,
          profileCompleted: false, // New Google users need to complete profile
        });
      }
    }

    if (!user.isActive) {
      throw new Error('Račun je deaktiviran');
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user,
      isNewUser,
      ...tokens,
    };
  }

  /**
   * Complete user profile (for Google users who need to add phone, etc.)
   */
  async completeProfile(
    userId: string,
    data: { phone?: string }
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        phone: data.phone,
        profileCompleted: true,
      },
      { new: true }
    ).select('-password -refreshToken');
  }

  /**
   * Set password for Google users who don't have one
   * Allows them to also log in with email/password
   */
  async setPassword(
    userId: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Korisnik nije pronađen');
    }

    // Check if user already has a password
    if (user.password) {
      throw new Error('Već imate postavljenu lozinku. Koristite opciju za promjenu lozinke.');
    }

    // Hash and set the new password
    user.password = await hashPassword(newPassword);
    await user.save();

    return {
      success: true,
      message: 'Lozinka uspješno postavljena. Sada se možete prijaviti i putem emaila.',
    };
  }

  /**
   * Check if user has a password set
   */
  async hasPassword(userId: string): Promise<boolean> {
    const user = await User.findById(userId).select('password');
    return !!user?.password;
  }

  /**
   * Request email change - requires password verification
   * Sends verification email to the NEW email address
   */
  async requestEmailChange(
    userId: string,
    newEmail: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Korisnik nije pronađen');
    }

    // Verify password
    if (!user.password) {
      throw new Error('Morate prvo postaviti lozinku da biste mogli promijeniti email');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Pogrešna lozinka');
    }

    // Check if new email is the same as current
    if (user.email.toLowerCase() === newEmail.toLowerCase()) {
      throw new Error('Nova email adresa mora biti različita od trenutne');
    }

    // Check if new email is already in use
    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      throw new Error('Ova email adresa je već u upotrebi');
    }

    // Delete any existing pending requests for this user
    await EmailChangeRequest.deleteMany({ userId: user._id });

    // Create new email change request
    const token = this.generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await EmailChangeRequest.create({
      userId: user._id,
      currentEmail: user.email,
      newEmail: newEmail.toLowerCase(),
      token,
      expiresAt,
    });

    // Send verification email to the NEW email address
    const userName = user.firstName || user.email.split('@')[0];
    await emailService.sendEmailChangeVerification(newEmail, token, userName);

    return {
      success: true,
      message: 'Verifikacijski link je poslan na novu email adresu. Provjerite inbox.',
    };
  }

  /**
   * Verify email change using the token from email
   */
  async verifyEmailChange(token: string): Promise<{ success: boolean; message: string; newEmail: string }> {
    const request = await EmailChangeRequest.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!request) {
      throw new Error('Nevažeći ili istekli link za promjenu emaila');
    }

    // Check if new email is still available
    const existingUser = await User.findOne({ email: request.newEmail });
    if (existingUser) {
      throw new Error('Ova email adresa je već u upotrebi');
    }

    // Update user's email
    const user = await User.findById(request.userId);
    if (!user) {
      throw new Error('Korisnik nije pronađen');
    }

    user.email = request.newEmail;
    await user.save();

    // Mark request as used
    request.used = true;
    await request.save();

    return {
      success: true,
      message: 'Email adresa uspješno promijenjena',
      newEmail: request.newEmail,
    };
  }

  /**
   * Check if there's a pending email change request
   */
  async getPendingEmailChange(userId: string): Promise<{ pending: boolean; newEmail?: string; expiresAt?: Date }> {
    const request = await EmailChangeRequest.findOne({
      userId,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (request) {
      return {
        pending: true,
        newEmail: request.newEmail,
        expiresAt: request.expiresAt,
      };
    }

    return { pending: false };
  }

  /**
   * Cancel pending email change request
   */
  async cancelEmailChange(userId: string): Promise<{ success: boolean; message: string }> {
    const result = await EmailChangeRequest.deleteMany({
      userId,
      used: false,
    });

    if (result.deletedCount === 0) {
      throw new Error('Nema zahtjeva za promjenu emaila');
    }

    return {
      success: true,
      message: 'Zahtjev za promjenu emaila je otkazan',
    };
  }
}

export const authService = new AuthService();
