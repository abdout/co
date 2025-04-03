import * as z from "zod";
import { SystemType } from "@/components/platform/project/constant";

export const projectFormSchema = z.object({
  // Basic Information
  projectName: z.string().min(1, "Project name is required"),
  location: z.string().min(1, "Location is required"),
  client: z.string().min(1, "Client is required"),
  consultant: z.string().min(1, "Consultant is required"),
  status: z.enum(["Draft", "Active", "Completed", "On Hold"], {
    required_error: "Status is required",
  }),
  
  // Team Information
  team: z.array(z.string()).min(1, "At least one team member is required"),
  teamLead: z.string().min(1, "Team lead is required"),
  
  // Systems and Activities
  systems: z.array(z.enum(['MV SWGR', 'HV SWGR', 'LV SWGR', 'POWER TRAFO', 'DIST. TRAFO', 'COMPONENT', 'RELAY', 'RMU', 'LOW CURRENT'])).min(1, "At least one system must be selected"),
  activities: z.array(z.object({
    system: z.enum(['MV SWGR', 'HV SWGR', 'LV SWGR', 'POWER TRAFO', 'DIST. TRAFO', 'COMPONENT', 'RELAY', 'RMU', 'LOW CURRENT']),
    category: z.string(),
    subcategory: z.string(),
    activity: z.string()
  })).min(1, "At least one activity is required"),
  
  // Resources
  mobilization: z.string().optional(),
  accommodation: z.string().optional(),
  kits: z.array(z.string()).optional(),
  cars: z.array(z.string()).optional(),
  
  // Additional Fields
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>; 