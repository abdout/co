import { UseFormSetValue } from "react-hook-form";
import { ActivitySchema } from "./validation";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export function useDate(setValue: UseFormSetValue<ActivitySchema>) {
  // Helper to parse ISO date strings to Date objects
  const parseISODateToDate = (isoDate: string | null | undefined): Date | undefined => {
    if (!isoDate) return undefined;
    const date = new Date(isoDate);
    return !isNaN(date.getTime()) ? date : undefined;
  };

  // Handle date range changes for different activity types
  const handleDateRangeChange = (activityType: string, range: DateRange) => {
    if (activityType === 'party') {
      setValue('partyStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('partyEndDate', range.to?.toISOString().split('T')[0] || '');
    } else if (activityType === 'union') {
      setValue('unionStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('unionEndDate', range.to?.toISOString().split('T')[0] || '');
    } else if (activityType === 'voluntary') {
      setValue('voluntaryStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('voluntaryEndDate', range.to?.toISOString().split('T')[0] || '');
    }
  };

  return {
    parseISODateToDate,
    handleDateRangeChange
  };
} 