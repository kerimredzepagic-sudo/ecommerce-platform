import { useQuery } from "@tanstack/react-query";

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

  // Handle empty responses
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ============ PRODUCTS ============

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  isOnSale: boolean;
  line?: "originals" | "premium" | "health" | "energy" | null;
  image: string | null;
  inStock: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ShopProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ShopProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Array<{ key: string; value: string }>;
  images: string[];
}

export interface ShopProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  isOnSale: boolean;
  line?: "originals" | "premium" | "health" | "energy" | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: ShopProductImage[];
  sku?: string;
  stock: number;
  inStock: boolean;
  variants: ShopProductVariant[];
  hasVariants: boolean;
  tags: string[];
  attributes: Record<string, string>;
  nutritionalInfo?: string;
}

export interface ShopProductListResponse {
  success: boolean;
  data: ShopProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ShopProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  line?: string;
  search?: string;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isOnSale?: boolean;
}

export function useShopProducts(filters: ShopProductFilters = {}) {
  const params = new URLSearchParams();
  
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.category) params.set("category", filters.category);
  if (filters.line) params.set("line", filters.line);
  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock !== undefined) params.set("inStock", String(filters.inStock));
  if (filters.isFeatured !== undefined) params.set("isFeatured", String(filters.isFeatured));
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
  if (filters.isOnSale !== undefined) params.set("isOnSale", String(filters.isOnSale));

  return useQuery({
    queryKey: ["shop", "products", filters],
    queryFn: () =>
      publicFetch<ShopProductListResponse>(`/products?${params.toString()}`),
  });
}

export function useShopProduct(slug: string) {
  return useQuery({
    queryKey: ["shop", "product", slug],
    queryFn: () =>
      publicFetch<{ success: boolean; data: ShopProductDetail }>(`/products/${slug}`),
    enabled: !!slug,
  });
}

// ============ CATEGORIES ============

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  order: number;
  isActive: boolean;
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
}

export interface ShopCategoriesResponse {
  success: boolean;
  data: ShopCategory[];
}

export function useShopCategories() {
  return useQuery({
    queryKey: ["shop", "categories"],
    queryFn: () =>
      publicFetch<ShopCategoriesResponse>("/categories"),
  });
}

// Category tree for navigation
export interface ShopCategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  order: number;
  isActive: boolean;
  children: ShopCategoryTreeNode[];
}

export interface ShopCategoryTreeResponse {
  success: boolean;
  data: ShopCategoryTreeNode[];
}

export function useShopCategoryTree() {
  return useQuery({
    queryKey: ["shop", "categories", "tree"],
    queryFn: () =>
      publicFetch<ShopCategoryTreeResponse>("/categories/tree"),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// ============ SLIDES ============

export interface ShopSlide {
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
}

export interface ShopSlidesResponse {
  success: boolean;
  data: ShopSlide[];
}

export function useShopSlides(location: "shop" | "corporate" = "shop") {
  return useQuery({
    queryKey: ["shop", "slides", location],
    queryFn: () =>
      publicFetch<ShopSlidesResponse>(`/slides/public/${location}`),
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

export interface BlogPostList {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    fullName: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  views: number;
  readingTime?: number;
}

export interface BlogPostDetail {
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
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  allowComments: boolean;
  views: number;
  readingTime?: number;
  relatedPosts?: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    excerpt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPostList[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogDetailResponse {
  success: boolean;
  data: BlogPostDetail;
}

export interface BlogCategoriesResponse {
  success: boolean;
  data: BlogCategory[];
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export function useBlogPosts(filters: BlogFilters = {}) {
  const params = new URLSearchParams();
  
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["blog", "posts", filters],
    queryFn: () =>
      publicFetch<BlogListResponse>(`/blog?${params.toString()}`),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () =>
      publicFetch<BlogDetailResponse>(`/blog/${slug}`),
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: () =>
      publicFetch<BlogCategoriesResponse>("/blog/categories"),
  });
}

// ============ CAREERS ============

export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";

export interface PublicCareer {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  shortDescription: string;
  coverImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  expiresAt?: string;
  order: number;
  views: number;
}

export interface PublicCareerDetail extends PublicCareer {
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  relatedCareers?: PublicCareer[];
}

export interface CareerListResponse {
  success: boolean;
  data: PublicCareer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CareerDetailResponse {
  success: boolean;
  data: PublicCareerDetail;
}

export interface CareerFilters {
  page?: number;
  limit?: number;
  department?: string;
  location?: string;
  employmentType?: EmploymentType;
  search?: string;
}

export function usePublicCareers(filters: CareerFilters = {}) {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.department) params.set("department", filters.department);
  if (filters.location) params.set("location", filters.location);
  if (filters.employmentType) params.set("employmentType", filters.employmentType);
  if (filters.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["careers", filters],
    queryFn: () =>
      publicFetch<CareerListResponse>(`/careers?${params.toString()}`),
  });
}

export function usePublicCareer(slug: string) {
  return useQuery({
    queryKey: ["career", slug],
    queryFn: () =>
      publicFetch<CareerDetailResponse>(`/careers/${slug}`),
    enabled: !!slug,
  });
}

export function useFeaturedCareers(limit = 5) {
  return useQuery({
    queryKey: ["careers", "featured", limit],
    queryFn: () =>
      publicFetch<{ success: boolean; data: PublicCareer[] }>(`/careers/featured?limit=${limit}`),
  });
}

export function useCareerDepartments() {
  return useQuery({
    queryKey: ["careers", "departments"],
    queryFn: () =>
      publicFetch<{ success: boolean; data: string[] }>("/careers/departments"),
  });
}

export function useCareerLocations() {
  return useQuery({
    queryKey: ["careers", "locations"],
    queryFn: () =>
      publicFetch<{ success: boolean; data: string[] }>("/careers/locations"),
  });
}

// ============ STORE LOCATIONS (Poslovnice) ============

export interface StoreLocationWorkingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: StoreLocationWorkingHours;
  image?: string;
  mapUrl?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
  order: number;
}

export function useStoreLocations() {
  return useQuery({
    queryKey: ["locations", "public"],
    queryFn: () =>
      publicFetch<{ success: boolean; data: StoreLocation[] }>("/locations/public"),
  });
}
