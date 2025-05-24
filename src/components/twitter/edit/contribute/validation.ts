import { z } from "zod";

export const contributeSchema = z.object({
  id: z.string().optional(),
  contribute: z.string().min(3, { message: "يرجى كتابة مساهمتك" }),
});

export type ContributeSchema = z.infer<typeof contributeSchema>; 