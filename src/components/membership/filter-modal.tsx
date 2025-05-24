'use client';

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface FilterModalProps {
  statusOptions: { value: string; label: string }[];
  responseOptions: { value: string; label: string }[];
  roleOptions: { value: string; label: string }[];
  onStatusChange: (status: string) => void;
  onResponseChange: (status: string) => void;
  onRoleChange: (role: string) => void;
  currentStatus: string;
  currentRole: string;
  closeModal: () => void;
}

export default function FilterModal({
  statusOptions,
  responseOptions,
  roleOptions,
  onStatusChange,
  onResponseChange,
  onRoleChange,
  currentStatus,
  currentRole,
  closeModal
}: FilterModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle option selection with auto-close
  const handleStatusChange = (value: string) => {
    onStatusChange(value);
    closeModal();
  };

  const handleResponseChange = (value: string) => {
    onResponseChange(value);
    closeModal();
  };

  const handleRoleChange = (value: string) => {
    onRoleChange(value);
    closeModal();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8">
      <div className="flex justify-between items-center w-full mb-8">
       
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            إغلاق
          </Button>
        )}
      </div>

      <div className="flex flex-col space-y-6 overflow-auto w-full max-w-md px-20 ">
        {/* Status Filter (الطلب) */}
        <div className="space-y-2 w-full">
          <label className="font-medium">الطلب</label>
          <Select 
            onValueChange={handleStatusChange}
            defaultValue={currentStatus}
          >
            <SelectTrigger className="w-full" dir="rtl">
              <SelectValue placeholder="اختر الطلب" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions
                .filter(opt => opt.value === "ALL" || opt.value === "COMPLETED" || opt.value === "INCOMPLETE")
                .map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        {/* Response Filter (الرد) */}
        <div className="space-y-2 w-full">
          <label className="font-medium">الرد</label>
          <Select 
            onValueChange={handleResponseChange}
            defaultValue={
              currentStatus === "APPROVED" ? "APPROVED" :
              currentStatus === "REJECTED" ? "REJECTED" :
              currentStatus === "NO_RESPONSE" ? "NO_RESPONSE" : "ALL"
            }
          >
            <SelectTrigger className="w-full" dir="rtl">
              <SelectValue placeholder="اختر الرد" />
            </SelectTrigger>
            <SelectContent>
              {responseOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter (الدور) */}
        <div className="space-y-2 w-full">
          <label className="font-medium">الدور</label>
          <Select 
            onValueChange={handleRoleChange}
            defaultValue={currentRole}
          >
            <SelectTrigger className="w-full" dir="rtl">
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 