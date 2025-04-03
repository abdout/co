'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Custom SVG icons as React components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="8" rx="1" />
      <path d="M3 11L12 4L21 11" />
    </g>
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="16" height="12" x="4" y="6" rx="2"/>
      <path d="m4 9l7.106 3.553a2 2 0 0 0 1.788 0L20 9"/>
    </g>
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
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
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
      <circle cx="12" cy="7" r="3"/>
    </g>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87c.074.04.147.083.22.127c.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124c.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      fill="none"
      stroke="currentColor" 
      strokeWidth="1.5" 
      d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0z"
    />
  </svg>
);

// Add TaskIcon for Daily Reports
const TaskIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
      <path d="M9 10l2 2l4-4" />
    </g>
  </svg>
);

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-md transition-colors w-32',
          active 
            ? 'text-black hover:bg-muted' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
    </Link>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  
  const sidebarItems = [
    {
      href: '/platform',
      icon: <HomeIcon className="h-5 w-5" />,
      label: 'Home'
    },
    {
      href: '/platform/messages',
      icon: <MessageIcon className="h-5 w-5" />,
      label: 'Messages'
    },
    {
      href: '/platform/notifications',
      icon: <NotificationIcon className="h-[18px] w-[18px]" />,
      label: 'Notifications'
    },
    {
      href: '/platform/profile',
      icon: <UserIcon className="h-5 w-5" />,
      label: 'Profile'
    },
    {
      href: '/platform/settings',
      icon: <SettingsIcon className="h-[18px] w-[18px]" />,
      label: 'Settings'
    }
  ];

  return (
    <aside className="h-full w-auto bg-background flex flex-col items-start py-6 px-3">
      <div className="flex flex-col gap-1.5 items-start w-full">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={
              item.href === '/platform' 
                ? pathname === '/platform' 
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar; 