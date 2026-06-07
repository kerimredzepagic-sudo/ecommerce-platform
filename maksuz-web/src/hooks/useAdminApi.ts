import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch } from "@/lib/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic fetch helper
async function adminFetch<T>(
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

// ============ PRODUCTS ============

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Array<{ key: string; value: string }>;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  isOnSale: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  image?: string | null; // Single image for list view
  images: ProductImage[];
  sku?: string;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  trackInventory: boolean;
  lowStockThreshold: number;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants: ProductVariant[];
  hasVariants: boolean;
  tags: string[];
  line?: "originals" | "premium" | "health" | "energy" | null;
  attributes: Record<string, string>;
  nutritionalInfo?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  line?: string;
  search?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

export function useProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.category) params.set("category", filters.category);
  if (filters.line) params.set("line", filters.line);
  if (filters.search) params.set("search", filters.search);
  if (filters.inStock !== undefined)
    params.set("inStock", String(filters.inStock));
  if (filters.isFeatured !== undefined)
    params.set("isFeatured", String(filters.isFeatured));
  if (filters.isActive !== undefined)
    params.set("isActive", String(filters.isActive));

  return useQuery({
    queryKey: ["admin", "products", filters],
    queryFn: () =>
      adminFetch<ProductListResponse>(`/products?${params.toString()}`),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Product }>(`/products/${id}`),
    enabled: !!id,
  });
}

export interface ProductInput {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images?: string[];
  sku?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductInput>) =>
      adminFetch<{ success: boolean; data: Product }>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) =>
      adminFetch<{ success: boolean; data: Product }>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// ============ CATEGORIES ============

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  parent: {
    id: string;
    name: string;
    slug: string;
    level?: number;
  } | null;
  ancestors?: {
    id: string;
    name: string;
    slug: string;
    level?: number;
  }[];
  isActive: boolean;
  order: number;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  order: number;
  isActive: boolean;
  parent?: { id: string; name: string };
  children: CategoryTreeNode[];
}

export interface CategoryFlatItem {
  id: string;
  name: string;
  level: number;
  fullPath: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Category[] }>("/categories"),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["admin", "categories", "tree"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: CategoryTreeNode[] }>(
        "/categories/tree"
      ),
  });
}

export function useCategoryFlatList() {
  return useQuery({
    queryKey: ["admin", "categories", "flat"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: CategoryFlatItem[] }>(
        "/categories/flat"
      ),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["admin", "category", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Category }>(`/categories/${id}`),
    enabled: !!id,
  });
}

// Input type for creating/updating categories (parent is just an ID)
export interface CategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parent?: string | null; // Parent category ID
  isActive?: boolean;
  order?: number;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) =>
      adminFetch<{ success: boolean; data: Category }>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) =>
      adminFetch<{ success: boolean; data: Category }>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      orderedIds: { id: string; order: number; parentId?: string | null }[]
    ) =>
      adminFetch("/categories/reorder", {
        method: "PUT",
        body: JSON.stringify({ orderedIds }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

// ============ ORDERS ============

export interface Order {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image?: string;
  }>;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
  trackingNumber?: string;
  guestName?: string;
  guestEmail?: string;
  promoCode?: {
    code: string;
    type: "percentage" | "fixed" | "free_shipping";
    value: number;
    discountAmount: number;
  };
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

export function useOrders(
  filters: { page?: number; limit?: number; status?: string } = {}
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);

  return useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: () =>
      adminFetch<OrderListResponse>(`/orders/admin/all?${params.toString()}`),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Order }>(`/orders/${id}`),
    enabled: !!id,
  });
}

// ============ ORDER ANALYTICS ============

export interface OrderAnalytics {
  pending: {
    count: number;
    value: number;
  };
  today: {
    count: number;
    revenue: number;
  };
  thisMonth: {
    count: number;
    revenue: number;
  };
  allTime: {
    count: number;
    revenue: number;
  };
  ordersByStatus: Array<{
    status: string;
    count: number;
    value: number;
  }>;
  topCustomers: Array<{
    userId: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }>;
}

export interface OrderAnalyticsResponse {
  success: boolean;
  data: OrderAnalytics;
}

export function useOrderAnalytics() {
  return useQuery({
    queryKey: ["admin", "orders", "analytics"],
    queryFn: () =>
      adminFetch<OrderAnalyticsResponse>("/orders/admin/analytics"),
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch<{ success: boolean; data: Order }>(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.id],
      });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      paymentStatus,
    }: {
      id: string;
      paymentStatus: string;
    }) =>
      adminFetch<{ success: boolean; data: Order }>(
        `/orders/${id}/payment-status`,
        {
          method: "PATCH",
          body: JSON.stringify({ paymentStatus }),
        }
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.id],
      });
    },
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      trackingNumber,
    }: {
      id: string;
      trackingNumber: string;
    }) =>
      adminFetch<{ success: boolean; data: Order }>(`/orders/${id}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ trackingNumber }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.id],
      });
    },
  });
}

// ============ CUSTOMERS ============

export interface CustomerStats {
  id: string;
  email: string;
  name: string;
  isRegistered: boolean;
  userId?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
}

export interface CustomerWithOrders extends CustomerStats {
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    itemCount: number;
  }>;
}

export interface CustomerListResponse {
  success: boolean;
  data: CustomerStats[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useCustomers(
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: "totalSpent" | "orderCount" | "lastOrderDate";
    sortOrder?: "asc" | "desc";
  } = {}
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  return useQuery({
    queryKey: ["admin", "customers", filters],
    queryFn: () =>
      adminFetch<CustomerListResponse>(`/customers?${params.toString()}`),
  });
}

export function useCustomer(email: string) {
  return useQuery({
    queryKey: ["admin", "customer", email],
    queryFn: () =>
      adminFetch<{ success: boolean; data: CustomerWithOrders }>(
        `/customers/${encodeURIComponent(email)}`
      ),
    enabled: !!email,
  });
}

// ============ BLOG ============

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;

  // Publishing
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  allowComments: boolean;

  // Engagement
  views: number;
  readingTime?: number;
  relatedPosts?: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useBlogPosts(
  filters: {
    page?: number;
    limit?: number;
    isPublished?: boolean;
    search?: string;
  } = {}
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.isPublished !== undefined)
    params.set("isPublished", String(filters.isPublished));
  if (filters.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["admin", "blog", filters],
    queryFn: () =>
      adminFetch<BlogListResponse>(`/blog/admin/all?${params.toString()}`),
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ["admin", "blogPost", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: BlogPost }>(`/blog/admin/${id}`),
    enabled: !!id,
  });
}

// Input type for creating/updating blog posts (category is just an ID)
export interface BlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string; // Category ID
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  isPublished?: boolean;
  scheduledAt?: string;
  isFeatured?: boolean;
  allowComments?: boolean;
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogPostInput) =>
      adminFetch<{ success: boolean; data: BlogPost }>("/blog", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostInput }) =>
      adminFetch<{ success: boolean; data: BlogPost }>(`/blog/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminFetch(`/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
    },
  });
}

// ============ BLOG CATEGORIES ============

export function useBlogCategories() {
  return useQuery({
    queryKey: ["admin", "blogCategories"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: BlogCategory[] }>(
        "/blog/admin/categories"
      ),
  });
}

export function useBlogCategory(id: string) {
  return useQuery({
    queryKey: ["admin", "blogCategory", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: BlogCategory }>(
        `/blog/admin/categories/${id}`
      ),
    enabled: !!id,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlogCategory>) =>
      adminFetch<{ success: boolean; data: BlogCategory }>(
        "/blog/admin/categories",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogCategories"] });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogCategory> }) =>
      adminFetch<{ success: boolean; data: BlogCategory }>(
        `/blog/admin/categories/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogCategories"] });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/blog/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogCategories"] });
    },
  });
}

// ============ CONTACTS ============

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  repliedAt?: string;
  createdAt: string;
}

export interface ContactListResponse {
  success: boolean;
  data: Contact[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useContacts(
  filters: { page?: number; limit?: number; status?: string } = {}
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);

  return useQuery({
    queryKey: ["admin", "contacts", filters],
    queryFn: () =>
      adminFetch<ContactListResponse>(`/contact?${params.toString()}`),
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ["admin", "contact", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Contact }>(`/contact/${id}`),
    enabled: !!id,
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch<{ success: boolean; data: Contact }>(`/contact/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/contact/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
    },
  });
}

export function useNewContactsCount() {
  return useQuery({
    queryKey: ["admin", "contacts", "newCount"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: { count: number } }>(
        "/contact/new-count"
      ),
    refetchInterval: 60000, // Refetch every minute
  });
}

// ============ SLIDES ============

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  headTitle?: string;
  backgroundType: "image" | "video";
  backgroundUrl: string;
  buttonPrimaryText?: string;
  buttonPrimaryLink?: string;
  buttonSecondaryText?: string;
  buttonSecondaryLink?: string;
  order: number;
  isActive: boolean;
  location: "shop" | "corporate";
  createdAt: string;
  updatedAt: string;
}

export interface SlideInput {
  title: string;
  subtitle?: string;
  description?: string;
  headTitle?: string;
  backgroundType: "image" | "video";
  backgroundUrl: string;
  buttonPrimaryText?: string;
  buttonPrimaryLink?: string;
  buttonSecondaryText?: string;
  buttonSecondaryLink?: string;
  order?: number;
  isActive?: boolean;
  location?: "shop" | "corporate";
}

export function useSlides(location?: "shop" | "corporate") {
  const params = new URLSearchParams();
  if (location) params.set("location", location);

  return useQuery({
    queryKey: ["admin", "slides", location],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Slide[] }>(
        `/slides${params.toString() ? `?${params.toString()}` : ""}`
      ),
  });
}

export function useSlide(id: string) {
  return useQuery({
    queryKey: ["admin", "slide", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Slide }>(`/slides/${id}`),
    enabled: !!id && id !== "new",
  });
}

export function useCreateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SlideInput) =>
      adminFetch<{ success: boolean; data: Slide }>("/slides", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "slides"] });
    },
  });
}

export function useUpdateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SlideInput> }) =>
      adminFetch<{ success: boolean; data: Slide }>(`/slides/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "slides"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "slide", variables.id],
      });
    },
  });
}

export function useDeleteSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/slides/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "slides"] });
    },
  });
}

export function useReorderSlides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slides: Array<{ id: string; order: number }>) =>
      adminFetch("/slides/reorder", {
        method: "POST",
        body: JSON.stringify({ slides }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "slides"] });
    },
  });
}

export function useToggleSlideActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch<{ success: boolean; data: Slide }>(
        `/slides/${id}/toggle-active`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "slides"] });
    },
  });
}

// ============ SHIPPING SETTINGS ============

export interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  taxRate: number;
}

export function useShippingSettings() {
  return useQuery({
    queryKey: ["admin", "settings", "shipping"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: ShippingSettings }>(
        "/settings/shipping"
      ),
  });
}

export function useUpdateShippingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShippingSettings>) =>
      adminFetch<{ success: boolean; data: ShippingSettings }>(
        "/settings/shipping",
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "settings", "shipping"],
      });
    },
  });
}

// ============ PROMO CODES ============

export interface PromoCode {
  _id: string;
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  usedInOrders: string[];
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodeListResponse {
  success: boolean;
  data: PromoCode[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePromoCodeInput {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderAmount?: number;
  maxUses?: number | null;
  validFrom: string;
  validUntil: string;
}

export function usePromoCodes(
  filters: { page?: number; limit?: number; isActive?: boolean } = {}
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.isActive !== undefined)
    params.set("isActive", String(filters.isActive));

  return useQuery({
    queryKey: ["admin", "promoCodes", filters],
    queryFn: async () => {
      const response = await adminFetch<PromoCodeListResponse>(
        `/promo-codes?${params.toString()}`
      );
      // Add id field for DataTable compatibility
      return {
        ...response,
        data: response.data.map((promo) => ({ ...promo, id: promo._id })),
      };
    },
  });
}

export function usePromoCode(id: string) {
  return useQuery({
    queryKey: ["admin", "promoCode", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: PromoCode }>(`/promo-codes/${id}`),
    enabled: !!id,
  });
}

// Promo code with populated orders
export interface PromoCodeWithOrders extends Omit<PromoCode, "usedInOrders"> {
  usedInOrders: Array<{
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    shippingAddress: {
      firstName: string;
      lastName: string;
    };
    guestEmail?: string;
    guestName?: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

export function usePromoCodeWithOrders(id: string) {
  return useQuery({
    queryKey: ["admin", "promoCode", id, "orders"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: PromoCodeWithOrders }>(
        `/promo-codes/${id}/orders`
      ),
    enabled: !!id,
  });
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromoCodeInput) =>
      adminFetch<{ success: boolean; data: PromoCode }>("/promo-codes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promoCodes"] });
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: Partial<CreatePromoCodeInput> & { id: string; isActive?: boolean }) =>
      adminFetch<{ success: boolean; data: PromoCode }>(`/promo-codes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promoCodes"] });
    },
  });
}

export function useTogglePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch<{ success: boolean; data: PromoCode }>(
        `/promo-codes/${id}/toggle`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promoCodes"] });
    },
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/promo-codes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promoCodes"] });
    },
  });
}

// ============ CAREERS ============

export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  coverImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  expiresAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerListResponse {
  success: boolean;
  data: Career[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CareerFilters {
  page?: number;
  limit?: number;
  department?: string;
  location?: string;
  employmentType?: EmploymentType;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export function useCareers(filters: CareerFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.department) params.set("department", filters.department);
  if (filters.location) params.set("location", filters.location);
  if (filters.employmentType) params.set("employmentType", filters.employmentType);
  if (filters.search) params.set("search", filters.search);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
  if (filters.isFeatured !== undefined) params.set("isFeatured", String(filters.isFeatured));

  return useQuery({
    queryKey: ["admin", "careers", filters],
    queryFn: () =>
      adminFetch<CareerListResponse>(`/careers/admin/all?${params.toString()}`),
  });
}

export function useCareer(id: string) {
  return useQuery({
    queryKey: ["admin", "career", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Career }>(`/careers/admin/${id}`),
    enabled: !!id && id !== "new",
  });
}

export interface CareerInput {
  title: string;
  slug?: string;
  department: string;
  location: string;
  employmentType?: EmploymentType;
  shortDescription: string;
  fullDescription: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  coverImage?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  expiresAt?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  order?: number;
}

export function useCreateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CareerInput) =>
      adminFetch<{ success: boolean; data: Career }>("/careers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
    },
  });
}

export function useUpdateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CareerInput> }) =>
      adminFetch<{ success: boolean; data: Career }>(`/careers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "career", id] });
    },
  });
}

export function useDeleteCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/careers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
    },
  });
}

export function useCareerDepartments() {
  return useQuery({
    queryKey: ["admin", "careers", "departments"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: string[] }>("/careers/departments"),
  });
}

export function useCareerLocations() {
  return useQuery({
    queryKey: ["admin", "careers", "locations"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: string[] }>("/careers/locations"),
  });
}

// ============ LOCATIONS (Poslovnice) ============

export interface LocationWorkingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface Location {
  id: string;
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: LocationWorkingHours;
  image?: string;
  mapUrl?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationInput {
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours?: LocationWorkingHours;
  image?: string;
  mapUrl?: string;
  features?: string[];
  isHighlight?: boolean;
  isActive?: boolean;
  order?: number;
}

export function useLocations() {
  return useQuery({
    queryKey: ["admin", "locations"],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Location[] }>("/locations"),
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["admin", "location", id],
    queryFn: () =>
      adminFetch<{ success: boolean; data: Location }>(`/locations/${id}`),
    enabled: !!id && id !== "new",
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LocationInput) =>
      adminFetch<{ success: boolean; data: Location }>("/locations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LocationInput> }) =>
      adminFetch<{ success: boolean; data: Location }>(`/locations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "location", id] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/locations/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
    },
  });
}

export function useReorderLocations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locations: Array<{ id: string; order: number }>) =>
      adminFetch("/locations/reorder", {
        method: "POST",
        body: JSON.stringify({ locations }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
    },
  });
}

export function useToggleLocationActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch<{ success: boolean; data: Location }>(
        `/locations/${id}/toggle-active`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
    },
  });
}

export function useToggleLocationHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch<{ success: boolean; data: Location }>(
        `/locations/${id}/toggle-highlight`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "locations"] });
    },
  });
}