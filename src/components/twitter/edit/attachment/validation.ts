import { z } from "zod";

export const attachmentSchema = z.object({
  id: z.string().optional(),
  image: z.string({ required_error: "الصورة الشخصية مطلوبة" }),
  cv: z.string().optional(),
  portfolio: z.string().optional(),
  cover: z.string().optional(),
 
});

export type AttachmentSchema = z.infer<typeof attachmentSchema>; 