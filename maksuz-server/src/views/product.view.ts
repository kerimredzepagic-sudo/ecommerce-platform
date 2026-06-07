import { IProduct, ICategory } from '../models';

export interface ProductImageDTO {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Array<{ key: string; value: string }>;
  images: string[];
}

export interface ProductDTO {
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
  line?: 'originals' | 'premium' | 'health' | 'energy' | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: ProductImageDTO[];
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
  variants: ProductVariantDTO[];
  hasVariants: boolean;
  tags: string[];
  attributes: Record<string, string>;
  nutritionalInfo?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListDTO {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  isOnSale: boolean;
  line?: 'originals' | 'premium' | 'health' | 'energy' | null;
  image: string | null;
  sku?: string;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export function toProductDTO(product: IProduct): ProductDTO {
  const category = product.category as unknown as ICategory | null;

  // Use the isOnSale virtual which respects sale date restrictions
  const isOnSale = (product as any).isOnSale || false;

  let discount: number | undefined;
  if (isOnSale && product.compareAtPrice && product.compareAtPrice > product.price) {
    discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discount,
    isOnSale,
    saleStartDate: product.saleStartDate?.toISOString(),
    saleEndDate: product.saleEndDate?.toISOString(),
    line: product.line || null,
    category: category
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })),
    sku: product.sku,
    stock: product.stock,
    inStock: product.stock > 0 || product.allowBackorder,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    trackInventory: product.trackInventory,
    lowStockThreshold: product.lowStockThreshold,
    allowBackorder: product.allowBackorder,
    weight: product.weight,
    dimensions: product.dimensions,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      attributes: v.attributes,
      images: v.images,
    })),
    hasVariants: product.hasVariants,
    tags: product.tags,
    attributes: Object.fromEntries(product.attributes),
    nutritionalInfo: product.nutritionalInfo,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toProductListDTO(product: IProduct): ProductListDTO {
  const category = product.category as unknown as ICategory | null;

  // Use the isOnSale virtual which respects sale date restrictions
  const isOnSale = (product as any).isOnSale || false;

  let discount: number | undefined;
  if (isOnSale && product.compareAtPrice && product.compareAtPrice > product.price) {
    discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }

  // Get primary image or first image
  const primaryImage = product.images.find((img) => img.isPrimary);
  const firstImage = product.images[0];
  const imageUrl = primaryImage?.url || firstImage?.url || null;

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discount,
    isOnSale,
    line: product.line || null,
    image: imageUrl,
    sku: product.sku,
    stock: product.stock,
    inStock: product.stock > 0 || product.allowBackorder,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    category: category
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
  };
}

export function toProductListDTOs(products: IProduct[]): ProductListDTO[] {
  return products.map(toProductListDTO);
}

