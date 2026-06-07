import { z } from 'zod';

export const createCareerSchema = z.object({
  title: z.string().min(1, 'Naziv pozicije je obavezan'),
  slug: z.string().optional(),
  department: z.string().min(1, 'Odjel je obavezan'),
  location: z.string().min(1, 'Lokacija je obavezna'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  shortDescription: z.string().min(1, 'Kratki opis je obavezan').max(500, 'Kratki opis ne može imati više od 500 karaktera'),
  fullDescription: z.string().min(1, 'Puni opis je obavezan'),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
  metaTitle: z.string().max(60, 'Meta naslov ne može imati više od 60 karaktera').optional(),
  metaDescription: z.string().max(160, 'Meta opis ne može imati više od 160 karaktera').optional(),
  order: z.number().optional(),
});

export const updateCareerSchema = createCareerSchema.partial();

export const careerQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
});
