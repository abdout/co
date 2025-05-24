import { z } from "zod";

// Helper validation function to check if at least one other field is filled
const hasAtLeastOneOtherContactMethod = (data: any) => {
  const otherFields = [
    data.whatsapp,
    data.twitter, 
    data.facebook, 
    data.linkedin, 
    data.link,
    data.telegram, 
    data.instagram, 
    data.tiktok
  ];
  
  return otherFields.some(field => field && field.trim() !== '');
};

export const contactSchema = z.object({
  id: z.string().optional(),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  whatsapp: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  link: z.string().optional(),
  telegram: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional()
}).refine(hasAtLeastOneOtherContactMethod, {
  message: "طريقة اتصال اضافية مطلوبة",
  path: ["whatsapp"] // Attach the error to the whatsapp field
});

export type ContactSchema = z.infer<typeof contactSchema>;