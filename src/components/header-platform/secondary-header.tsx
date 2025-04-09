'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { resrc } from '@/constant/header';

interface SecondaryHeaderProps {
  projectId?: string;
  section: 'project' | 'resource' | 'wallet' | null;
}

export function SecondaryHeader({ projectId, section }: SecondaryHeaderProps) {
  const pathname = usePathname();

  // Define menu items based on the section
  const menuItems = React.useMemo(() => {
    if (section === 'project' && projectId) {
      return [
        { href: `/project/${projectId}`, label: "Detail" },
        { href: `/project/${projectId}/itp`, label: "ITP" },
        { href: `/project/${projectId}/mos`, label: "MOS" },
        { href: `/project/${projectId}/plan`, label: "Plan" },
        { href: `/project/${projectId}/report`, label: "Report" },
        { href: `/project/${projectId}/doc`, label: "Docs" },
        { href: `/project/${projectId}/quote`, label: "Quote" },
      ];
    } else if (section === 'resource') {
      return resrc; // Use the resource links from the constant file
    } else if (section === 'wallet') {
      return [
        { href: `/wallet/timesheet`, label: "Timesheet" },
        { href: `/wallet/pettycash`, label: "Pettycash" },
        { href: `/wallet/invoice`, label: "Invoice" },
        { href: `/wallet/salary`, label: "Salary" },
      ];
    }
    
    return [];
  }, [section, projectId]);

  // If no menu items or section is null, don't render the header
  if (!menuItems.length || !section) {
    return null;
  }

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="container flex h-10 max-w-screen-2xl items-center">
        <div className="flex overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "whitespace-nowrap transition-colors hover:text-foreground/80",
                  pathname === item.href || 
                  (item.label !== "Detail" && pathname.startsWith(item.href))
                    ? "text-foreground font-medium"
                    : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 