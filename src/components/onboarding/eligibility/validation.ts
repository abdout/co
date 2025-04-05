import { z } from 'zod';
import { eligibility } from './constant';

// Define the schema for activity with system
const activityWithSystemSchema = z.object({
  system: z.string(),
  category: z.string(),
  subcategory: z.string(),
  activity: z.string()
});

// Define the schema for form validation
// Making eligibility optional to allow empty submission
export const activitySchema = z.object({
  // Selected eligibility items - allowing empty array
  eligibility: z.array(z.string()).optional().default([]),
});

// Export the inferred type from the schema
export type ActivitySchema = z.infer<typeof activitySchema>;

// Export the type for activities with system
export type ActivityWithSystem = z.infer<typeof activityWithSystemSchema>;
