import { z } from 'zod';

export const teamFormSchema = z.object({
  id: z.string().min(1, 'Team member ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  iqama: z.string().optional(),
  eligible: z.array(z.string()).default([]),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>; 