import { TASK_STATUS, TASK_PRIORITY } from './constant';
import { TaskStatus, TaskPriority } from '@prisma/client';

export interface Activity {
  system: string;
  category: string;
  subcategory: string;
  activity: string;
}

export type TaskStatusType = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type TaskPriorityType = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];

export interface Task {
  _id?: string;
  id?: string;
  project: string;
  task: string;
  club: string;
  status: TaskStatus | TaskStatusType;
  priority: TaskPriority | TaskPriorityType;
  duration: string;
  desc: string;
  label: string;
  tag: string;
  remark: string;
  date?: Date | null;
  hours?: number | null;
  overtime?: number | null;
  linkedActivity?: {
    projectId: string;
    system: string;
    category: string;
    subcategory: string;
    activity: string;
  } | null;
  assignedTo?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreateFormProps {
  taskToEdit?: Task | null;
  onSuccess?: () => Promise<void>;
  onClose?: () => void;
}

export interface TaskContextProps {
  task: Task | null;
  tasks: Task[];
  fetchTask: (id: string) => void;
  fetchTasks: () => void;
  refreshTasks: () => void;
  deleteTask: (id: string) => void;
  createTask: (data: Task) => void; 
  updateTask: (id: string, data: Partial<Task>) => void; 
}
