'use client';

import { useState, useEffect } from 'react';
import { getUnreadNotificationsCount } from './action';

export function NotificationIcon({ className }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    };
    
    fetchUnreadCount();
    
    // Set up polling or websocket connection for live updates
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        className={className}
      >
        <path 
          fill="currentColor" 
          d="M21.53 14.47L20 13v-3a8 8 0 0 0-7-7.94V1h-2v1.06A8 8 0 0 0 4 9v3L2.47 13.47A1 1 0 0 0 2 14v2a1 1 0 0 0 1 1h5v1a4 4 0 0 0 8 0v-1h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-.47-.53ZM14 18a2 2 0 0 1-4 0v-1h4Zm6-3H4v-.59l1.53-1.53A1 1 0 0 0 6 12v-3a6 6 0 0 1 12 0v3a1 1 0 0 0 .47.88L20 14.41Z"
        />
      </svg>
      
      {unreadCount > 0 && (
        <span className="absolute bottom-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
} 