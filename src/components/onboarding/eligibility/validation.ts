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
export const activitySchema = z.object({
  // Selected eligibility items
  eligibility: z.array(z.string()),
});

// Export the inferred type from the schema
export type ActivitySchema = z.infer<typeof activitySchema>;

// Export the type for activities with system
export type ActivityWithSystem = z.infer<typeof activityWithSystemSchema>;
