import * as z from "zod";

export const carFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Car name is required"),
  images: z.array(z.string()).optional(),
  status: z.string().optional().nullable(),
  under: z.string().optional().nullable(),
  sim: z.string().optional().nullable(),
  petrol: z.number().optional().nullable(),
  oil: z.string().optional().nullable(),
  km: z.number().optional().nullable(),
  licence: z.string().optional().nullable(),
  penalty: z.string().optional().nullable(),
  history: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>; 