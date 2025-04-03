import * as z from "zod";
import { TASK_STATUS, TASK_PRIORITY } from './constant';

const linkedActivitySchema = z.object({
  projectId: z.string().optional(),
  system: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  activity: z.string().optional()
}).optional();

export const taskFormSchema = z.object({
  project: z.string().optional(),
  task: z.string().optional(),
  status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.STUCK, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE])
    .default(TASK_STATUS.PENDING),
  priority: z.enum([TASK_PRIORITY.PENDING, TASK_PRIORITY.HIGH, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.LOW])
    .default(TASK_PRIORITY.PENDING),
  duration: z.string().optional().default("4"),
  desc: z.string().optional().default(""),
  tag: z.string().optional().default(""),
  remark: z.string().optional().default(""),
  date: z.date().optional(),
  hours: z.number().optional(),
  overtime: z.number().optional(),
  linkedActivity: linkedActivitySchema,
  assignedTo: z.array(z.string()).optional().default([]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>; 