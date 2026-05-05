"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  login: (tokens: AuthTokens, user: User, redirect?: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUser();
      const tokens = getTokens();

      if (storedUser && tokens) {
        if (isTokenExpired(tokens.accessToken)) {
          try {
            await refreshAccessToken();
            setUser(storedUser);
          } catch {
            clearAuth();
          }
        } else {
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (tokens: AuthTokens, userData: User, redirect?: string) => {
    setStoredTokens(tokens);
    setStoredUser(userData);
    setUser(userData);

    if (redirect) {
      router.push(redirect);
    } else if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/shop");
    }
  };

  const logout = async () => {
    try {
      await performLogout();
    } catch {
      // Ignore logout errors
    }
    clearAuth();
    setUser(null);
    router.push("/login");
  };

  const updateUser = (updatedUser: User) => {
    setStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    logout,
    updateUser,
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
