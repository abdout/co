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
  system?: string;
  category?: string;
  subcategory?: string;
  activity?: string;
}

export interface Project {
  id?: string;
  customer?: string;
  description?: string;
  location?: string;
  client?: string;
  consultant?: string;
  status?: "pending" | "on_progress" | "done" | "stuck";
  priority?: "high" | "medium" | "low" | "pending";
  phase?: "approved" | "started" | "half_way" | "handover";
  team?: string[];
  teamLead?: string;
  systems?: string[];
  activities?: Activity[];
  mobilization?: string;
  accommodation?: string;
  kits?: string[];
  cars?: string[];
  startDate?: Date;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
} 