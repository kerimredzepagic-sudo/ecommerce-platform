import { z } from 'zod';

// Helper to handle empty strings as undefined for optional datetime fields
const optionalDatetime = z.preprocess(
  (val) => (val === '' || val === null ? undefined : val),
  z.string().datetime().optional().nullable()
);

// Image schema
const productImageSchema = z.object({
  url: z.string().url('Neispravan URL slike'),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

// Variant attribute schema
const variantAttributeSchema = z.object({
  key: z.string().min(1, 'Ključ atributa je obavezan'),
  value: z.string().min(1, 'Vrijednost atributa je obavezna'),
});

// Variant schema
const productVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Naziv varijante je obavezan'),
  sku: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional().default(0),
  attributes: z.array(variantAttributeSchema).optional().default([]),
  images: z.array(z.string().url()).optional().default([]),
});

// Dimensions schema
const dimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
});

export const createProductSchema = z.object({
  // Basic info
  name: z.string().min(1, 'Naziv proizvoda je obavezan'),
  description: z.string().min(1, 'Opis je obavezan'),
  shortDescription: z.string().optional(),
  
  // Pricing
  price: z.number().min(0, 'Cijena ne može biti negativna'),
  compareAtPrice: z.number().min(0).optional().nullable(),
  saleStartDate: optionalDatetime,
  saleEndDate: optionalDatetime,
  
  // Organization
  category: z.string().min(1, 'Kategorija je obavezna'),
  tags: z.array(z.string()).optional().default([]),
  
  // Media
  images: z.array(productImageSchema).optional().default([]),
  
  // Inventory
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional().default(0),
  trackInventory: z.boolean().optional().default(true),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
  allowBackorder: z.boolean().optional().default(false),
  
  // Status
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  
  // Shipping
  weight: z.number().min(0).optional().nullable(),
  dimensions: dimensionsSchema.optional().nullable(),
  
  // Variants
  variants: z.array(productVariantSchema).optional().default([]),
  hasVariants: z.boolean().optional().default(false),
  
  // Custom attributes
  attributes: z.record(z.string()).optional().default({}),
  
  // Nutritional Information (Rich Text)
  nutritionalInfo: z.string().optional(),
  
  // SEO
  metaTitle: z.string().max(60, 'Meta naslov može imati max 60 karaktera').optional(),
  metaDescription: z.string().max(160, 'Meta opis može imati max 160 karaktera').optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  inStock: z.enum(['true', 'false']).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  onSale: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['price', 'name', 'createdAt', 'stock']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const updateStockSchema = z.object({
  quantity: z.number().int(),
});

// Types derived from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
