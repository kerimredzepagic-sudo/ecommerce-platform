import { z } from 'zod';

const optionalDatetime = z.preprocess(
  (val) => (val === '' || val === null ? undefined : val),
  z.string().datetime().optional().nullable()
);

const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

const variantAttributeSchema = z.object({
  key: z.string().min(1, 'Attribute key is required'),
  value: z.string().min(1, 'Attribute value is required'),
});

const productVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional().default(0),
  attributes: z.array(variantAttributeSchema).optional().default([]),
  images: z.array(z.string().url()).optional().default([]),
});

const dimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  compareAtPrice: z.number().min(0).optional().nullable(),
  saleStartDate: optionalDatetime,
  saleEndDate: optionalDatetime,
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(productImageSchema).optional().default([]),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional().default(0),
  trackInventory: z.boolean().optional().default(true),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
  allowBackorder: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  weight: z.number().min(0).optional().nullable(),
  dimensions: dimensionsSchema.optional().nullable(),
  variants: z.array(productVariantSchema).optional().default([]),
  hasVariants: z.boolean().optional().default(false),
  attributes: z.record(z.string()).optional().default({}),
  metaTitle: z.string().max(60, 'Meta title max 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description max 160 characters').optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const updateStockSchema = z.object({
  quantity: z.number().int(),
});
