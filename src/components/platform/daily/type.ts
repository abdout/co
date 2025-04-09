import { DailyFormValues } from './validation';

export interface Daily {
  id: string;
  _id?: string;
  task?: string;
  description?: string;
  date?: string;
  engineer?: string;
  project?: string;
  status?: string;
  priority?: string;
  hoursSpent?: string;
  completionPercentage?: string;
  blockers?: string;
  plannedTomorrow?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DailyContextProps {
  daily: Daily | null;
  dailyReports: Daily[];
  loading: boolean;
  fetchDaily: (id: string) => Promise<void>;
  fetchDailyReports: () => Promise<void>;
  refreshDailyReports: () => void;
  deleteDaily: (id: string) => Promise<void>;
  createDaily: (data: Partial<DailyFormValues>) => Promise<any>; 
  updateDaily: (id: string, data: Partial<DailyFormValues>) => Promise<any>;
  syncTasksWithDailies: () => Promise<any>;
} 