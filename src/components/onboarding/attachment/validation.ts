import { z } from "zod";

export const attachmentSchema = z.object({
  id: z.string().optional(),
  image: z.string().optional(),
  resume: z.string().optional(),
  iqama: z.string().optional(),
  sce: z.string().optional(),
  passport: z.string().optional(),
  drivingLicense: z.string().optional(),
});

export type AttachmentSchema = z.infer<typeof attachmentSchema>; 