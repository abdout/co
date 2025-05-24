'use client';

import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from './action';
import { Notification } from './type';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

// Define a type for the database notification format
type DatabaseNotification = {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  title: string;
  content: string;
  isRead: boolean;
  metadata: any;
};

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await getUserNotifications(20, 0);
      
      // Transform the database notifications to match the Notification interface
      const transformedNotifications: Notification[] = data.map((notification: DatabaseNotification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        type: notification.type as any, // Convert string to NotificationType enum
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        metadata: notification.metadata
      }));
      
      setNotifications(transformedNotifications);
      setLoading(false);
    };
    
    fetchNotifications();
  }, []);
  
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  if (loading) {
    return <div className="p-4 text-center">جارٍ التحميل...</div>;
  }
  
  if (notifications.length === 0) {
    return <div className="p-4 text-center">لا توجد إشعارات</div>;
  }
  
  return (
    <div className="divide-y">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-4 hover:bg-muted transition-colors cursor-pointer ${
            !notification.isRead ? 'bg-muted/50' : ''
          }`}
          onClick={() => handleMarkAsRead(notification.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">{notification.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true,
                locale: ar 
              })}
            </span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">{notification.content}</p>
        </div>
      ))}
    </div>
  );
} 