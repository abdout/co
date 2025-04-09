export const DAILY_STATUS = {
  PENDING: "pending",
  STUCK: "stuck",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed"
} as const;

export const DAILY_PRIORITY = {
  PENDING: "pending",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low"
} as const;

export const DAILY_STATUS_LABELS = {
  [DAILY_STATUS.PENDING]: "Pending",
  [DAILY_STATUS.STUCK]: "Stuck",
  [DAILY_STATUS.IN_PROGRESS]: "In Progress",
  [DAILY_STATUS.COMPLETED]: "Completed"
};

export const DAILY_PRIORITY_LABELS = {
  [DAILY_PRIORITY.PENDING]: "Pending",
  [DAILY_PRIORITY.HIGH]: "High",
  [DAILY_PRIORITY.MEDIUM]: "Medium",
  [DAILY_PRIORITY.LOW]: "Low"
};

export const DAILY_STATUS_OPTIONS = Object.entries(DAILY_STATUS_LABELS).map(([value, label]) => ({
  value,
  label
}));

export const DAILY_PRIORITY_OPTIONS = Object.entries(DAILY_PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label
})); 