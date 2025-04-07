import * as z from "zod";

export const kitFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  images: z.array(z.string()).optional(),
  accessories: z.array(z.string()).optional(),
  calibration: z.string().optional(),
  calibrationIssue: z.string().optional(),
  calibrationDue: z.string().optional(),
  software: z.string().optional(),
  datasheet: z.string().optional(),
  manual: z.string().optional(),
  status: z.string().optional(),
  under: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type KitFormValues = z.infer<typeof kitFormSchema>; 