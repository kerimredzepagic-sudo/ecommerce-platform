import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { User, AuthTokens } from "@/lib/authClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// Custom error for unverified accounts
export class UnverifiedAccountError extends Error {
  email: string;
  constructor(email: string, message: string) {
    super(message);
    this.name = "UnverifiedAccountError";
    this.email = email;
  }
}

// Login mutation
export function useLogin(redirectUrl?: string) {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle unverified account error
        if (data.code === "UNVERIFIED_ACCOUNT") {
          throw new UnverifiedAccountError(data.email, data.error);
        }
        throw new Error(data.error || data.message || "Login failed");
      }

      return data;
    },
    onSuccess: (data) => {
      // Update auth context - login function handles redirect
      login(
        {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        },
        data.data.user,
        redirectUrl // Pass redirect URL, login() will handle role-based redirect if undefined
      );

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    requiresVerification: boolean;
  };
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      return data;
    },
  });
}

// Logout mutation
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();

      // Redirect handled by logout function
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (refreshToken: string): Promise<AuthTokens> => {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Token refresh failed");
      }

      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    },
    onSuccess: () => {
      // Invalidate queries to refetch with new token
      queryClient.invalidateQueries();
    },
  });
}

// Verify email mutation
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string): Promise<{ verified: boolean; message: string }> => {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Greška pri verifikaciji emaila");
      }

      return data.data;
    },
  });
}

// Resend verification email mutation
export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: async (email: string): Promise<{ email: string }> => {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Greška pri slanju verifikacijskog emaila");
      }

      return data.data;
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string): Promise<{ email: string }> => {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Greška pri slanju emaila");
      }

      return data.data;
    },
  });
}

// Verify reset code mutation
export function useVerifyCode() {
  return useMutation({
    mutationFn: async ({
      email,
      code,
    }: {
      email: string;
      code: string;
    }): Promise<{ token: string }> => {
      const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Neispravan ili istekao kod");
      }

      return data.data;
    },
  });
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }): Promise<void> => {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Greška pri resetovanju lozinke");
      }
    },
  });
}

// Resend code mutation
export function useResendCode() {
  return useMutation({
    mutationFn: async (email: string): Promise<{ email: string }> => {
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Greška pri slanju koda");
      }

      return data.data;
    },
  });
}
