import { z } from 'zod';

export const teamFormSchema = z.object({
  id: z.string().min(1, 'Team member ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  src: z.string().min(1, 'Image source is required'),
  alt: z.string().optional(),
  phone: z.string().optional(),
  mail: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required'),
  width: z.number().positive('Width must be positive').default(105),
  height: z.number().positive('Height must be positive').default(105),
  iqama: z.string().optional(),
  eligible: z.array(z.string()).default([]),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>; 