import * as z from "zod";
import { DAILY_STATUS, DAILY_PRIORITY } from './constant';

export const dailyFormSchema = z.object({
  task: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  engineer: z.string().optional(),
  project: z.string().optional(),
  status: z.string().optional().default(DAILY_STATUS.PENDING),
  priority: z.string().optional().default(DAILY_PRIORITY.PENDING),
  hoursSpent: z.string().optional(),
  completionPercentage: z.string().optional(),
  blockers: z.string().optional(),
  plannedTomorrow: z.string().optional(),
});

export type DailyFormValues = z.infer<typeof dailyFormSchema>; 