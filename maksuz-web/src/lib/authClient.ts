/**
 * Client-side auth utilities for handling authentication
 */

export type AuthProvider = "email" | "google";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: "user" | "admin";
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  provider: AuthProvider;
  profileCompleted: boolean;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Get stored tokens from localStorage
 */
export function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

/**
 * Get stored user from localStorage
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Store tokens in localStorage and as cookies for middleware
 */
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);

  // Set cookie with actual token expiration time
  const maxAge = getTokenExpiresIn(tokens.accessToken);
  document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

/**
 * Store user in localStorage and role as cookie for middleware
 */
export function setUser(user: User): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("user", JSON.stringify(user));

  // Set role cookie - sync with access token expiration for consistency
  const tokens = getTokens();
  const maxAge = tokens ? getTokenExpiresIn(tokens.accessToken) : 3600; // Default 1 hour
  document.cookie = `userRole=${user.role}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

/**
 * Clear all auth data from localStorage and cookies
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Clear cookies
  document.cookie = "accessToken=; path=/; max-age=0";
  document.cookie = "userRole=; path=/; max-age=0";
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    // Consider token expired 30 seconds before actual expiry for safety margin
    return Date.now() >= (exp - 30000);
  } catch {
    return true; // Invalid token = treat as expired
  }
}

/**
 * Get token expiration time in seconds from now
 */
export function getTokenExpiresIn(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const expiresIn = Math.floor((exp - Date.now()) / 1000);
    return Math.max(0, expiresIn);
  } catch {
    return 0;
  }
}

/**
 * Check if user is authenticated (has valid, non-expired tokens)
 */
export function isAuthenticated(): boolean {
  const tokens = getTokens();
  if (!tokens) return false;
  
  // If access token is expired, check if we have a valid refresh token
  if (isTokenExpired(tokens.accessToken)) {
    // Refresh token should still be valid for auto-refresh
    return !isTokenExpired(tokens.refreshToken);
  }
  
  return true;
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin";
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens) return false;

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      clearAuth();
      return false;
    }

    const data = await response.json();
    // Handle both response formats (backend returns data.data, frontend route returns data directly)
    const newTokens = data.data || data;
    setTokens({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearAuth();
    return false;
  }
}

/**
 * Make an authenticated API request with automatic token refresh
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Not authenticated");
  }

  // Add authorization header
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${tokens.accessToken}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newTokens = getTokens();
      if (newTokens) {
        headers.set("Authorization", `Bearer ${newTokens.accessToken}`);
        return fetch(url, {
          ...options,
          headers,
        });
      }
    }
  }

  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const tokens = getTokens();
    if (tokens) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuth();
  }
}
