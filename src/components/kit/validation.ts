import * as z from "zod";

export const kitFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  bg: z.string().optional(),
  calibration: z.string().optional(),
  datasheet: z.string().optional(),
  manual: z.string().optional(),
  status: z.string().optional(),
  under: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
});

export type KitFormValues = z.infer<typeof kitFormSchema>; 