'use client'

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Daily } from './type'
import DailyForm from './form'
import DeleteDaily from './delete'
import { DAILY_STATUS_LABELS, DAILY_PRIORITY_LABELS } from './constant'
import { useModal } from '@/components/atom/modal/context'

// TeamCell component to display team members with rounded images
const TeamCell: React.FC = () => {
  return (
    <div className="flex -space-x-2">
      <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64" 
          alt="Team member 1"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=64" 
          alt="Team member 2"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

interface ActionsCellProps {
  row: { original: Daily };
  onDailyUpdate?: () => Promise<void>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row, onDailyUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { openModal } = useModal();
  
  return (
    <div className="flex items-center justify-center gap-0.5" data-action="no-navigate">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          openModal('edit-daily', row.original);
        }}
        className="h-8 w-8 p-0"
        data-action="no-navigate"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          openModal('delete-daily', row.original);
        }}
        className="h-8 w-8 p-0 text-destructive"
        data-action="no-navigate"
      >
        <span className="sr-only">Delete</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </Button>
    </div>
  );
};

interface StatusCircleProps {
  status: string;
}

const StatusCircle: React.FC<StatusCircleProps> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    'pending': 'bg-gray-400',
    'stuck': 'bg-red-500',
    'in_progress': 'bg-yellow-400',
    'completed': 'bg-green-500'
  };
  const colorClass = statusStyles[status.toLowerCase()] || 'bg-gray-400'; // Default color

  return (
    <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};

interface PriorityCircleProps {
  priority: string;
}

const PriorityCircle: React.FC<PriorityCircleProps> = ({ priority }) => {
  const priorityColors: { [key: string]: string } = {
    'high': 'bg-red-400',
    'medium': 'bg-yellow-400',
    'low': 'bg-blue-400',
    'neutral': 'bg-gray-400',
    'Neutral': 'bg-gray-400',
    'Low': 'bg-blue-400',
    'Medium': 'bg-yellow-400',
    'High': 'bg-red-400',
  };
  const colorClass = priorityColors[priority.toLowerCase()] || 'bg-gray-400'; // Default color

  return (
    <div className={`w-4 h-4 rounded-full ${colorClass}`} />
  );
};

// Construct the columns with a function that accepts the onDailyUpdate callback
export const getColumns = (onDailyUpdate?: () => Promise<void>): ColumnDef<Daily>[] => [
  {
    accessorKey: 'task',
    header: ({ column }) => {
      return (
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Task
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const task = row.getValue('task') as string;
      const tag = row.original.blockers;
      
      return (
        <div className="flex items-center gap-2">
          <span>{task}</span>
          {tag && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-800">
              {tag}
            </div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'engineer',
    header: ({ column }) => {
      return (
        <Button
          className='p-0 m-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Engineer
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
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
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusLabel = DAILY_STATUS_LABELS[status as keyof typeof DAILY_STATUS_LABELS] || status;
      
      return (
        <div className="flex items-center gap-2">
          <StatusCircle status={status} />
          <span>{statusLabel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: () => <div>Priority</div>,
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const priorityLabel = DAILY_PRIORITY_LABELS[priority as keyof typeof DAILY_PRIORITY_LABELS] || priority;
      
      return (
        <div className="flex items-center gap-2">
          <PriorityCircle priority={priority} />
          <span>{priorityLabel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'completionPercentage',
    header: () => <div>Completion</div>,
    cell: ({ row }) => {
      const completion = row.getValue('completionPercentage') as string;
      return <span>{completion}%</span>;
    },
  },
  {
    accessorKey: 'hoursSpent',
    header: () => <div>Hours</div>,
    cell: ({ row }) => {
      const hours = row.getValue('hoursSpent') as string;
      return <span>{hours}</span>;
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-center w-full pl-8">Actions</div>,
    cell: ({ row }) => (
      <div className="pl-8">
        <ActionsCell row={row} onDailyUpdate={onDailyUpdate} />
      </div>
    ),
  }
]; 