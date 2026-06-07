import crypto from 'crypto';
import { PasswordResetToken, User } from '../models';
import { emailService } from './email.service';
import { hashPassword } from '../utils/password';

class PasswordResetService {
  private readonly CODE_LENGTH = 6;
  private readonly EXPIRY_MINUTES = 15;

  /**
   * Generate a random 6-digit code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate a unique token for password reset
   */
  private generateToken(): string {
    return crypto.randomUUID();
  }

  /**
   * Request password reset - generates code and sends email
   */
  async requestReset(email: string): Promise<{ success: boolean; message: string }> {
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return {
        success: true,
        message: 'Ako postoji račun sa ovim emailom, poslaćemo vam kod za resetovanje.',
      };
    }

    // Delete any existing tokens for this email
    await PasswordResetToken.deleteMany({ email: email.toLowerCase() });

    // Generate code and token
    const code = this.generateCode();
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000);

    // Create new reset token
    await PasswordResetToken.create({
      email: email.toLowerCase(),
      code,
      token,
      expiresAt,
      used: false,
    });

    // Send email
    const emailSent = await emailService.sendPasswordResetEmail(email, code);

    if (!emailSent) {
      // Delete the token if email failed
      await PasswordResetToken.deleteOne({ token });
      return {
        success: false,
        message: 'Greška pri slanju emaila. Pokušajte ponovo.',
      };
    }

    return {
      success: true,
      message: 'Ako postoji račun sa ovim emailom, poslaćemo vam kod za resetovanje.',
    };
  }

  /**
   * Verify the reset code
   */
  async verifyCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; token?: string; message: string }> {
    const resetToken = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return {
        success: false,
        message: 'Neispravan ili istekao kod. Pokušajte ponovo.',
      };
    }

    // Mark as used for verification but keep it for password reset
    // We'll use the token for the actual password reset
    return {
      success: true,
      token: resetToken.token,
      message: 'Kod je uspješno verificiran.',
    };
  }

  /**
   * Reset the password using the token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return {
        success: false,
        message: 'Neispravan ili istekao token. Zatražite novi kod.',
      };
    }

    // Find user and update password
    const user = await User.findOne({ email: resetToken.email });

    if (!user) {
      return {
        success: false,
        message: 'Korisnik nije pronađen.',
      };
    }

    // Hash and update password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Mark token as used and delete it
    await PasswordResetToken.deleteOne({ token });

    return {
      success: true,
      message: 'Lozinka je uspješno resetovana.',
    };
  }

  /**
   * Resend the reset code
   */
  async resendCode(email: string): Promise<{ success: boolean; message: string }> {
    // Simply request a new reset
    return this.requestReset(email);
  }
}

export const passwordResetService = new PasswordResetService();

