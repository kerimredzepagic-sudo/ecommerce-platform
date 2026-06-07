import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Naslov je obavezan'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Izvod je obavezan').max(500, 'Izvod ne može imati više od 500 karaktera'),
  content: z.string().min(1, 'Sadržaj je obavezan'),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  
  // SEO
  metaTitle: z.string().max(60, 'Meta naslov ne može imati više od 60 karaktera').optional(),
  metaDescription: z.string().max(160, 'Meta opis ne može imati više od 160 karaktera').optional(),
  canonicalUrl: z.string().url('Nevažeća URL adresa').optional().or(z.literal('')),
  ogImage: z.string().optional(),
  
  // Publishing
  isPublished: z.boolean().optional(),
  scheduledAt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  
  // Related
  relatedPosts: z.array(z.string()).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  isPublished: z.enum(['true', 'false']).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
});

// Blog Category Validators
export const createBlogCategorySchema = z.object({
  name: z.string().min(1, 'Naziv kategorije je obavezan'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();
