import { ActivityWithSystem } from './validation';
import { Systems, Eligibility } from './constant';

export interface ActivityUser {
  id: string;
  eligibility?: Eligibility[];
  systems?: Systems[];
  activities?: ActivityWithSystem[];
}

export interface ActivityFormProps {
  user: ActivityUser;
}

export interface Option {
  label: string;
  value: string;
}

// Used for rendering activities in the UI
export interface CategoryWithActivities {
  category: string;
  subcategories: {
    name: string;
    activities: string[];
  }[];
}

export type DateRange = {
  from?: Date;
  to?: Date;
}; 