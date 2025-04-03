import { z } from "zod";

export const contactSchema = z.object({
  id: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  telegram: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional()
});

export type ContactSchema = z.infer<typeof contactSchema>;