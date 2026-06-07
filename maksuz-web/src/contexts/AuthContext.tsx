"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  getUser,
  getTokens,
  setUser as setStoredUser,
  setTokens as setStoredTokens,
  logout as performLogout,
  clearAuth,
  isTokenExpired,
  refreshAccessToken,
  type User,
  type AuthTokens,
} from "@/lib/authClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  profileCompleted: boolean;
  login: (tokens: AuthTokens, user: User, redirect?: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();

  // Initialize auth state from localStorage with token validation
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUser();
      const tokens = getTokens();

      if (storedUser && tokens) {
        // Check if access token is expired
        if (isTokenExpired(tokens.accessToken)) {
          console.log("Access token expired, attempting refresh...");
          // Try to refresh the token
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            console.log("Token refresh failed, clearing auth");
            clearAuth();
            setIsLoading(false);
            return;
          }
          console.log("Token refreshed successfully");
        }
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle NextAuth session - sync with our auth context
  useEffect(() => {
    if (sessionStatus === "authenticated" && session) {
      const backendUser = (session as any).backendUser;
      const accessToken = (session as any).accessToken;
      const refreshToken = (session as any).refreshToken;
      const isNewUser = (session as any).isNewUser;
      const profileCompleted = (session as any).profileCompleted;

      // If we have backend data from NextAuth, sync it to our context
      if (backendUser && accessToken && refreshToken && !user) {
        setStoredTokens({ accessToken, refreshToken });
        setStoredUser(backendUser);
        setUser(backendUser);

        // Redirect new Google users to complete profile
        if (
          isNewUser &&
          !profileCompleted &&
          pathname !== "/complete-profile"
        ) {
          router.push("/complete-profile");
        } else if (pathname === "/login" || pathname === "/register") {
          // Role-based redirect after Google login
          if (backendUser.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/account");
          }
        }
      }
    }
  }, [session, sessionStatus, user, pathname, router]);

  const login = (tokens: AuthTokens, userData: User, redirect?: string) => {
    setStoredTokens(tokens);
    setStoredUser(userData);
    setUser(userData);

    // Role-based redirect
    if (redirect) {
      router.push(redirect);
    } else if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  };

  const logout = async () => {
    try {
      // Logout from our backend
      await performLogout();
      // Also sign out from NextAuth if there's a session
      if (sessionStatus === "authenticated") {
        await signOut({ redirect: false });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setUser(null);
      router.push("/login");
    }
  };

  const updateUser = (userData: User) => {
    setStoredUser(userData);
    setUser(userData);
  };

  const refreshUser = async () => {
    const tokens = getTokens();
    if (!tokens) return;

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStoredUser(data.data);
          setUser(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const profileCompleted = user?.profileCompleted ?? true;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading: isLoading || sessionStatus === "loading",
    profileCompleted,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for protecting routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

// Custom hook for protecting admin routes
export function useRequireAdmin() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/admin");
      } else if (!isAdmin) {
        router.push("/?error=unauthorized");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  return { isAuthenticated, isAdmin, isLoading };
}
