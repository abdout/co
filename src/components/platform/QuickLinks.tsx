import React from 'react';
import Link from 'next/link';
import { 
  FileText,
  BarChart3,
  Calculator,
  Users,
  MapPin,
  BookOpen,
  Clock
} from 'lucide-react';

interface QuickLink {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const quickLinks: QuickLink[] = [
  { title: 'Invoice', icon: <FileText />, href: '/platform/invoice' },
  { title: 'Report', icon: <BarChart3 />, href: '/platform/reports' },
  { title: 'Math', icon: <Calculator />, href: '/platform/math' },
  { title: 'Contact', icon: <Users />, href: '/platform/contacts' },
  { title: 'Location', icon: <MapPin />, href: '/platform/location' },
  { title: 'Manual', icon: <BookOpen />, href: '/platform/manual' },
  { title: 'Timesheet', icon: <Clock />, href: '/platform/timesheet' },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
      {quickLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className="flex flex-col px-8 py-4 rounded-lg border border-border hover:border-primary transition-colors duration-200 bg-card hover:bg-accent/50"
        >
          <div className="w-9 h-9  text-primary">{link.icon}</div>
          <span className="text-sm font-medium">{link.title}</span>
        </Link>
      ))}
    </div>
  );
} 