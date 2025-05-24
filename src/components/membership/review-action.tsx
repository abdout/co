'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Loader2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { SuccessToast, ErrorToast } from '@/components/atom/toast';
import { approveApplication, rejectApplication, redoApplication, updateUserRole } from '@/components/membership/action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ReviewActionsProps = {
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  userId: string;
  applicationStatus?: string;
  role?: string;
};

export function ReviewActions({ isSubmitting, onSubmit, userId, applicationStatus, role: initialRole }: ReviewActionsProps) {
  const [status, setStatus] = useState(applicationStatus || 'PENDING');
  const [role, setRole] = useState(initialRole || 'USER');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  const roleOptions = [
    { value: 'ADMIN', label: 'مسؤل' },
    { value: 'DEVELOPER', label: 'مطور' },
    { value: 'USER', label: 'مستخدم' },
    { value: 'MEMBER', label: 'عضو' },
    { value: 'MEMBERSHIP', label: 'امين العضوية' },
    { value: 'FINANCE', label: 'امين المال' },
    { value: 'CONTENT', label: 'امين المحتوى' },
  ];

  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    const result = await updateUserRole(userId, newRole);
    setLoading(false);
    if (result.success) {
      setRole(newRole);
      SuccessToast();
      router.refresh();
    } else {
      ErrorToast(result.error || 'حدث خطأ أثناء تغيير الدور');
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveApplication(userId);
    setLoading(false);
    if (result.success) {
      SuccessToast();
      router.push('/dashboard/membership');
    } else {
      ErrorToast(result.error || 'حدث خطأ أثناء القبول');
    }
  };

  const handleUndo = async () => {
    setLoading(true);
    const result = await redoApplication(userId);
    setLoading(false);
    if (result.success) {
      SuccessToast();
      router.push('/dashboard/membership');
    } else {
      ErrorToast(result.error || 'حدث خطأ أثناء التراجع');
    }
  };

  const handleReject = () => {
    toast(
      'متأكد تريد رفض الطلب؟',
      {
        style: {
          background: '#dc2626',
          color: 'white',
          maxWidth: 220,
        },
        className: 'bg-red-600 text-white',
        action: {
          label: <span className="">تأكيد</span>,
          onClick: async () => {
            setLoading(true);
            const result = await rejectApplication(userId);
            setLoading(false);
            if (result.success) {
              SuccessToast();
              router.push('/dashboard/membership');
            } else {
              ErrorToast(result.error || 'حدث خطأ أثناء الرفض');
            }
          },
        },
        cancel: "إلغاء",
        duration: 8000,
      }
    );
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {/* Role Dropdown */}
      <Select
        value={role}
        onValueChange={handleRoleChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[160px] h-10 text-right" dir="rtl">
          <SelectValue placeholder="اختر الدور" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {roleOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value} className="text-right" dir="rtl">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Approve/Undo Button */}
      <Button
        onClick={isApproved ? handleUndo : handleApprove}
        disabled={loading || isRejected}
        variant="outline"
        size="lg"
        className={isApproved ? 'bg-green-100 text-green-700 border-green-400' : ''}
      >
        {loading && !isApproved ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري القبول...</>
        ) : isApproved ? (
          <><Undo2 className="mr-2 h-4 w-4" /> تراجع</>
        ) : (
          'قبول'
        )}
      </Button>
      {/* Reject/Undo Button */}
      <Button
        onClick={isRejected ? handleUndo : handleReject}
        disabled={loading || isApproved}
        variant={isRejected ? 'outline' : 'destructive'}
        size="lg"
        className={isRejected ? 'ml-4 bg-yellow-100 text-yellow-700 border-yellow-400' : 'ml-4'}
      >
        {isRejected ? (
          <><Undo2 className="mr-2 h-4 w-4" /> تراجع</>
        ) : (
          'رفض'
        )}
      </Button>
    </div>
  );
} 