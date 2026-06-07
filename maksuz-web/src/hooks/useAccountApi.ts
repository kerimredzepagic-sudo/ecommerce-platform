import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch } from "@/lib/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic fetch helper for account endpoints
async function accountFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await authenticatedFetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Handle empty responses (e.g., 204 No Content from DELETE)
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ============ ORDER TYPES ============

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  success: boolean;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

// ============ ORDER HOOKS ============

export function useMyOrders(filters: { page?: number; limit?: number; status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);

  return useQuery({
    queryKey: ["account", "orders", filters],
    queryFn: () =>
      accountFetch<OrderListResponse>(`/orders?${params.toString()}`),
  });
}

export function useMyOrderStats() {
  return useQuery({
    queryKey: ["account", "orderStats"],
    queryFn: () =>
      accountFetch<{ success: boolean; data: OrderStats }>("/orders/my-stats"),
  });
}

export function useMyOrder(id: string) {
  return useQuery({
    queryKey: ["account", "order", id],
    queryFn: () =>
      accountFetch<{ success: boolean; data: Order }>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      accountFetch<{ success: boolean; data: Order }>(`/orders/${id}/cancel`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["account", "orderStats"] });
    },
  });
}

// ============ PROFILE HOOKS ============

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: UserAddress;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface SetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      accountFetch<{ success: boolean; message: string }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      accountFetch<{ success: boolean; message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function useSetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetPasswordInput) =>
      accountFetch<{ success: boolean; message: string }>("/auth/set-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "has-password"] });
    },
  });
}

export function useHasPassword() {
  return useQuery({
    queryKey: ["account", "has-password"],
    queryFn: () =>
      accountFetch<{ success: boolean; data: { hasPassword: boolean } }>("/auth/has-password"),
  });
}

// ============ EMAIL CHANGE HOOKS ============

export interface RequestEmailChangeInput {
  newEmail: string;
  password: string;
}

export interface PendingEmailChange {
  pending: boolean;
  newEmail?: string;
  expiresAt?: string;
}

export function useRequestEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestEmailChangeInput) =>
      accountFetch<{ success: boolean; message: string }>("/auth/request-email-change", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "pending-email-change"] });
    },
  });
}

export function useVerifyEmailChange() {
  return useMutation({
    mutationFn: (token: string) =>
      accountFetch<{ success: boolean; message: string; data: { newEmail: string } }>(
        "/auth/verify-email-change",
        {
          method: "POST",
          body: JSON.stringify({ token }),
        }
      ),
  });
}

export function usePendingEmailChange() {
  return useQuery({
    queryKey: ["account", "pending-email-change"],
    queryFn: () =>
      accountFetch<{ success: boolean; data: PendingEmailChange }>("/auth/pending-email-change"),
  });
}

export function useCancelEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      accountFetch<{ success: boolean; message: string }>("/auth/cancel-email-change", {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "pending-email-change"] });
    },
  });
}
