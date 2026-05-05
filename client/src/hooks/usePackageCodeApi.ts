import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTokens } from "@/lib/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic public fetch helper (no authentication required)
async function publicFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Authenticated fetch helper (requires admin token)
async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  const tokens = getTokens();
  if (tokens?.accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${tokens.accessToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ============ PACKAGE CODE TYPES ============

export interface PackageCodeCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface PackageCodePublic {
  code: string;
  serviceName: string;
  serviceSlug: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: "pending" | "active" | "exhausted" | "expired" | "cancelled";
  expiresAt?: string;
  customer: {
    name: string;
    email: string;
  };
}

export interface PackageCodeValidation {
  valid: boolean;
  message?: string;
  packageCode?: PackageCodePublic;
}

export interface PackageCodeRedemption {
  bookingId: string;
  bookingNumber: string;
  redeemedAt: string;
  slotId: string;
}

export interface PackageCodeFull {
  id: string;
  code: string;
  booking: {
    id: string;
    bookingNumber: string;
  };
  service: {
    id: string;
    name: string;
    slug: string;
    sessionsIncluded: number;
    validityDays?: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: "pending" | "active" | "exhausted" | "expired" | "cancelled";
  activatedAt?: string;
  activatedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  expiresAt?: string;
  redemptions: PackageCodeRedemption[];
  cancelledAt?: string;
  cancelledBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageCodeListItem {
  id: string;
  code: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  serviceName: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: "pending" | "active" | "exhausted" | "expired" | "cancelled";
  activatedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface RedeemCodeInput {
  code: string;
  slotId: string;
  notes?: string;
}

export interface RedeemCodeResponse {
  success: boolean;
  data: {
    booking: {
      id: string;
      bookingNumber: string;
      customer: {
        name: string;
        email: string;
        phone: string;
      };
      service: {
        id: string;
        name: string;
        slug: string;
        price: number;
        duration: number;
        sessionsIncluded: number;
        isPackage: boolean;
      };
      sessions: Array<{
        slotId: string;
        date: string;
        startTime: string;
        endTime: string;
        status: string;
      }>;
      totalPrice: number;
      status: string;
      paymentMethod: string;
      paymentStatus: string;
      createdAt: string;
    };
    remainingSessions: number;
  };
  message: string;
}

// ============ PUBLIC HOOKS ============

/**
 * Validate a package code (public)
 */
export function useValidatePackageCode(code: string) {
  return useQuery({
    queryKey: ["package-codes", "validate", code],
    queryFn: () =>
      publicFetch<{ success: boolean; data: PackageCodeValidation }>(
        `/package-codes/validate/${encodeURIComponent(code)}`
      ),
    enabled: !!code && code.length >= 10,
  });
}

/**
 * Lookup package code details (public)
 */
export function usePackageCodeLookup(code: string) {
  return useQuery({
    queryKey: ["package-codes", "lookup", code],
    queryFn: () =>
      publicFetch<{ success: boolean; data: PackageCodePublic }>(
        `/package-codes/lookup/${encodeURIComponent(code)}`
      ),
    enabled: !!code && code.length >= 10,
  });
}

/**
 * Redeem package code to book appointment (public)
 */
export function useRedeemPackageCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RedeemCodeInput) =>
      publicFetch<RedeemCodeResponse>("/package-codes/redeem", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (_, variables) => {
      // Invalidate slot availability cache
      queryClient.invalidateQueries({ queryKey: ["api-slots", "available"] });
      // Invalidate package code queries
      queryClient.invalidateQueries({ queryKey: ["package-codes", "validate", variables.code] });
      queryClient.invalidateQueries({ queryKey: ["package-codes", "lookup", variables.code] });
    },
  });
}

// ============ ADMIN HOOKS ============

export interface PackageCodeFilters {
  page?: number;
  limit?: number;
  status?: "pending" | "active" | "exhausted" | "expired" | "cancelled";
  email?: string;
}

/**
 * Get all package codes (admin)
 */
export function useAdminPackageCodes(filters: PackageCodeFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.limit) params.set("limit", filters.limit.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.email) params.set("email", filters.email);

  return useQuery({
    queryKey: ["admin", "package-codes", filters],
    queryFn: () =>
      adminFetch<{
        success: boolean;
        data: PackageCodeListItem[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/package-codes/admin/all?${params.toString()}`),
  });
}

/**
 * Get package code by ID (admin)
 */
export function useAdminPackageCodeById(id: string) {
  return useQuery({
    queryKey: ["admin", "package-codes", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: PackageCodeFull }>(
        `/package-codes/admin/${id}`
      ),
    enabled: !!id,
  });
}

/**
 * Get package code by booking ID (admin)
 */
export function useAdminPackageCodeByBookingId(bookingId: string) {
  return useQuery({
    queryKey: ["admin", "package-codes", "booking", bookingId],
    queryFn: () =>
      adminFetch<{ success: boolean; data: PackageCodeFull }>(
        `/package-codes/admin/booking/${bookingId}`
      ),
    enabled: !!bookingId,
  });
}

/**
 * Activate package code (admin)
 */
export function useActivatePackageCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sendEmail = true }: { id: string; sendEmail?: boolean }) =>
      adminFetch<{ success: boolean; data: PackageCodeFull; message: string }>(
        `/package-codes/admin/${id}/activate`,
        {
          method: "POST",
          body: JSON.stringify({ sendEmail }),
        }
      ),
    onSuccess: () => {
      // Invalidate all package code queries
      queryClient.invalidateQueries({ queryKey: ["admin", "package-codes"] });
      // Invalidate booking queries as the booking status may have changed
      queryClient.invalidateQueries({ queryKey: ["admin", "api-bookings"] });
    },
  });
}

/**
 * Cancel package code (admin)
 */
export function useCancelPackageCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminFetch<{ success: boolean; data: PackageCodeFull; message: string }>(
        `/package-codes/admin/${id}/cancel`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "package-codes"] });
    },
  });
}
