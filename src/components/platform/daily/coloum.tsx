'use client'

import React, { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { daily } from '@/components/platform/daily/type'
import Link from 'next/link'
import { useDaily } from '@/components/platform/daily/context'
import Image from 'next/image'

// EngineerCell component to display user avatar
const EngineerCell: React.FC<{ engineer: string }> = ({ engineer }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
        <Image 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=64" 
          alt={engineer}
          fill
          className="object-cover"
        />
      </div>
      <span>{engineer}</span>
    </div>
  );
};

const ActionsCell: React.FC<{ row: { original: daily } }> = ({ row }) => {
  const { refreshDailyReports, dailyReports, deleteDaily } = useDaily();
  
  useEffect(() => {
    refreshDailyReports();
  }, [refreshDailyReports]);

  const report = row.original;

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(report._id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/daily/${report._id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem onClick={() => report._id && deleteDaily(report._id)}>Delete</DropdownMenuItem> 
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface StatusCircleProps {
  status: string;
}

const StatusCircle: React.FC<StatusCircleProps> = ({ status }) => {
  const statusColors: { [key: string]: string } = {
      'Not Started': 'bg-gray-400',
      'In Progress': 'bg-yellow-400',
      'Completed': 'bg-green-400',
      'Blocked': 'bg-red-400',
  }; 
  const colorClass = statusColors[status] || 'bg-gray-400'; // Default color

  return (
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};

interface PriorityCircleProps {
  priority: string;
}

const PriorityCircle: React.FC<PriorityCircleProps> = ({ priority }) => {
  const priorityColors: { [key: string]: string } = {
      'Low': 'bg-blue-400',
      'Medium': 'bg-yellow-400',
      'High': 'bg-orange-400',
      'Critical': 'bg-red-400',
  }; 
  const colorClass = priorityColors[priority] || 'bg-gray-400'; // Default color

  return (
      <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};

// Progress bar component for completion percentage
const ProgressBar: React.FC<{ percentage: string }> = ({ percentage }) => {
  const percent = parseInt(percentage) || 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export const columns: ColumnDef<daily>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'engineer',
    header: () => <div>Engineer</div>,
    cell: ({ row }) => <EngineerCell engineer={row.getValue('engineer')} />
  },
  {
    accessorKey: 'project',
    header: () => <div>Project</div>,
  },
  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <StatusCircle status={row.getValue('status')} />
            <span>{row.getValue('status')}</span>
        </div>
    ),
  },
  {
    accessorKey: 'priority',
    header: () => <div>Priority</div>,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <PriorityCircle priority={row.getValue('priority')} />
            <span>{row.getValue('priority')}</span>
        </div>
    ),
  },
  {
    accessorKey: 'hoursSpent',
    header: () => <div className="text-center">Hours</div>,
    cell: ({ row }) => (
        <div className="flex justify-center w-full">
            <span>{row.getValue('hoursSpent')} hrs</span>
        </div>
    ),
  },
  {
    accessorKey: 'completionPercentage',
    header: () => <div>Progress</div>,
    cell: ({ row }) => (
        <div className="w-full px-2">
            <ProgressBar percentage={row.getValue('completionPercentage')} />
            <div className="text-xs text-right mt-1">{row.getValue('completionPercentage')}%</div>
        </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Action</div>,
    cell: ActionsCell
  }
] 