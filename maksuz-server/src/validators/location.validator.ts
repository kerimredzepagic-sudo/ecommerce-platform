import { z } from "zod";

const workingHoursSchema = z.object({
  weekdays: z.string().min(1, "Radno vrijeme za radne dane je obavezno").default("08:00 - 20:00"),
  saturday: z.string().min(1, "Radno vrijeme za subotu je obavezno").default("08:00 - 16:00"),
  sunday: z.string().min(1, "Radno vrijeme za nedjelju je obavezno").default("Zatvoreno"),
});

export const createLocationSchema = z.object({
  name: z
    .string()
    .min(1, "Naziv poslovnice je obavezan")
    .max(100, "Naziv ne može biti duži od 100 karaktera"),
  subtitle: z
    .string()
    .max(50, "Podnaslov ne može biti duži od 50 karaktera")
    .optional(),
  address: z
    .string()
    .min(1, "Adresa je obavezna")
    .max(200, "Adresa ne može biti duža od 200 karaktera"),
  city: z
    .string()
    .min(1, "Grad je obavezan")
    .max(100, "Grad ne može biti duži od 100 karaktera"),
  phone: z
    .string()
    .min(1, "Telefon je obavezan")
    .max(50, "Telefon ne može biti duži od 50 karaktera"),
  email: z
    .string()
    .min(1, "Email je obavezan")
    .email("Unesite validan email")
    .max(100, "Email ne može biti duži od 100 karaktera"),
  workingHours: workingHoursSchema.optional(),
  image: z.string().optional(),
  mapUrl: z.string().url("Unesite validan URL").optional().or(z.literal("")),
  features: z.array(z.string()).optional().default([]),
  isHighlight: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

export const reorderLocationsSchema = z.object({
  locations: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type ReorderLocationsInput = z.infer<typeof reorderLocationsSchema>;
