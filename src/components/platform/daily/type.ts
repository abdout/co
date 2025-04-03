export type daily = {
  _id: string;
  title: string;
  description: string;
  date: string;
  engineer: string;
  project: string;
  status: string;
  priority: string;
  hoursSpent: string;
  completionPercentage: string;
  blockers: string;
  plannedTomorrow: string;
};

export interface DailyContextProps {
  daily: daily | null;
  dailyReports: daily[];
  fetchDaily: (id: string) => void;
  fetchDailyReports: () => void;
  refreshDailyReports: () => void;
  deleteDaily: (id: string) => void;
  createDaily: (data: daily) => void; 
  updateDaily: (id: string, data: Partial<daily>) => void; 
} 