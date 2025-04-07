import * as z from "zod";
import { type Systems } from "./types";

const activitySchema = z.object({
  system: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  activity: z.string().optional()
});

export const projectFormSchema = z.object({
  customer: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),
  consultant: z.string().optional(),
  status: z.enum(["pending", "on_progress", "done", "stuck"]).optional(),
  priority: z.enum(["high", "medium", "low", "pending"]).optional(),
  phase: z.enum(["approved", "started", "half_way", "handover"]).optional(),
  team: z.array(z.string()).optional(),
  teamLead: z.string().optional(),
  systems: z.array(z.enum(["MV SWGR", "HV SWGR", "LV SWGR", "POWER TRAFO", "DIST. TRAFO", "COMPONENT", "RELAY", "RMU", "LOW CURRENT"] as const)).optional(),
  activities: z.array(activitySchema).optional(),
  mobilization: z.string().optional(),
  accommodation: z.string().optional(),
  kits: z.array(z.string()).optional(),
  cars: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().nullable().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>; 