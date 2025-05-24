export enum NotificationType {
  ONBOARDING_SUBMITTED = 'ONBOARDING_SUBMITTED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  // Add more notification types as needed
}

export interface NotificationPayload {
  title: string;
  content: string;
  recipientId?: string; // For admin notifications, this might be null
  type: NotificationType;
  metadata?: Record<string, any>;
}

export interface Notification extends NotificationPayload {
  id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
} 