export type Systems = 'MV SWGR' | 'HV SWGR' | 'LV SWGR' | 'POWER TRAFO' | 'DIST. TRAFO' | 'COMPONENT' | 'RELAY' | 'RMU' | 'LOW CURRENT';

export interface TeamMember {
  id: string;
  name: string;
}

export interface TeamLead {
  id: string;
  name: string;
}

export interface Kit {
  id: string;
  name: string;
}

export interface Car {
  id: string;
  name: string;
}

export interface ActivityCategory {
  item: string;
  subitems: Array<{
    name: string;
    activities: string[];
  }>;
}

export interface ActivityWithSystem {
  system: Systems;
  category: string;
  subcategory: string;
  activity: string;
}

export interface ProjectCreateFormProps {
  projectToEdit?: Project | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
}

export interface Activity {
  system: string;
  category: string;
  subcategory: string;
  activity: string;
}

export interface Project {
  _id?: string;
  id?: string;
  project_id?: string;
  customer: string;
  location: string;
  details: string;
  team?: string[];
  activities?: Array<Activity>;
  tags?: string[];
  status: "pending" | "on_progress" | "done" | "stuck";
  priority: "high" | "medium" | "low" | "pending";
  phase: "approved" | "started" | "half_way" | "handover";
  description: string;
  client: string;
  consultant: string;
  teamLead: string;
  systems: string[];
  mobilization: string;
  accommodation: string;
  kits: string[];
  cars: string[];
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 