'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateUserRole } from './action'

export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio: string | null
  currentCountry: string | null
  currentLocality: string | null
  onboardingStatus?: string | null
  applicationStatus?: string | null
  role?: string | null
}

interface ActionsProps {
  row: {
    original: User
  }
  onStatusChange?: (userId: string, newStatus: string) => void
  onRoleChange?: (userId: string, newRole: string) => void
}

const roleOptions = [
  { value: 'ADMIN', label: 'مسؤل' },
  { value: 'DEVELOPER', label: 'مطور' },
  { value: 'USER', label: 'مستخدم' },
  { value: 'MEMBER', label: 'عضو' },
  { value: 'MEMBERSHIP', label: 'امين العضوية' },
  { value: 'FINANCE', label: 'امين المال' },
  { value: 'CONTENT', label: 'امين المحتوى' },
];

const ActionsCell: React.FC<ActionsProps> = ({ row, onStatusChange, onRoleChange }) => {
  const user = row.original;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(user.id, "APPROVED");
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(user.id, "REJECTED");
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    try {
      const result = await updateUserRole(user.id, newRole);
      setLoading(false);
      if (result.success) {
        toast.success('تم تغيير الدور بنجاح');
        if (onRoleChange) {
          onRoleChange(user.id, newRole);
        }
        router.refresh();
      } else {
        toast.error(result.error || 'حدث خطأ أثناء تغيير الدور');
      }
    } catch (error) {
      setLoading(false);
      toast.error('حدث خطأ أثناء تغيير الدور');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/membership/${user.id}`} onClick={(e) => e.stopPropagation()}>
            فتح
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={loading} onClick={(e) => e.stopPropagation()}>
            <span>الدور</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
              {roleOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  disabled={loading || user.role === option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleChange(option.value);
                  }}
                >
                  {option.label}
                  {user.role === option.value && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            handleApprove(e);
          }}
          disabled={user.applicationStatus === "APPROVED"}
        >
          قبول
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            handleReject(e);
          }}
          disabled={user.applicationStatus === "REJECTED"}
          className="text-red-600"
        >
          رفض
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = (
  onStatusChange?: (userId: string, newStatus: string) => void,
  onRoleChange?: (userId: string, newRole: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            className='p-0 m-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            الاسم
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : "??";
      
      // Limit name to first two words
      const displayName = user.name
        ? user.name.split(" ").slice(0, 2).join(" ")
        : "مستخدم بدون اسم";
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="hidden md:block h-6 w-6">
            <AvatarImage src={user.image || ""} alt={user.name || "عضو"} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span title={user.name || "مستخدم بدون اسم"}>{displayName}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'onboardingStatus',
    header: () => <div className="text-right">الطلب</div>,
    cell: ({ row }) => {
      const status = row.original.onboardingStatus;
      
      return status ? (
        status === "COMPLETED"
          ? "مكتمل"
          : "ناقص"
      ) : null;
    }
  },
  {
    accessorKey: 'applicationStatus',
    header: () => <div className="text-right">الرد</div>,
    cell: ({ row }) => {
      const status = row.original.applicationStatus;
      
      return status ? (
        status === "APPROVED"
          ? "مقبول"
          : status === "REJECTED"
          ? "مرفوض"
          : status === "PENDING"
          ? "بدون رد"
          : status
      ) : null;
    }
  },
  {
    accessorKey: 'role',
    header: () => <div className="text-right">الدور</div>,
    cell: ({ row }) => {
      const role = row.original.role;
      
      return role ? (
        role === "ADMIN"
          ? "مسؤل"
          : role === "DEVELOPER"
          ? "مطور"
          : role === "USER"
          ? "مستخدم"
          : role === "MEMBER"
          ? "عضو"
          : role === "MEMBERSHIP"
          ? "امين العضوية"
          : role === "FINANCE"
          ? "امين المال"
          : role === "CONTENT"
          ? "امين المحتوى"
          : role
      ) : null;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onStatusChange={onStatusChange} onRoleChange={onRoleChange} />
  }
] 