import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});

export const contactQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
});

