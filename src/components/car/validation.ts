import * as z from "zod";

export const carFormSchema = z.object({
  id: z.string().min(1, "Car ID is required"),
  name: z.string().min(1, "Car name is required"),
  src: z.string().min(1, "Image source is required"),
  alt: z.string().min(1, "Alt text is required"),
  sim: z.string().optional(),
  petrol: z.number().optional(),
  oil: z.string().optional(),
  history: z.string().optional(),
  status: z.string().optional(),
  under: z.string().optional(),
  km: z.number().optional(),
  width: z.number().optional(),
  licence: z.string().optional(),
  penalty: z.string().optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>; 