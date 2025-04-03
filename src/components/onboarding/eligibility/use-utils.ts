import { useEffect } from "react";
import React from "react";
import { Option } from "@/components/atom/auto-complete";

export function useUtils() {
  // Helper function to find option by value string
  const getOptionByValue = (options: Option[], value: string | null | undefined): Option | undefined => {
    if (!value) return undefined;
    return options.find(option => option.value === value);
  };

  // Helper function to render schema warning
  const renderSchemaWarning = (field: string): React.ReactElement | null => {
    if (field === 'voluntary') {
      return React.createElement("div", { className: "text-xs text-amber-600 mt-1 flex items-center" },
        React.createElement("svg", { 
          xmlns: "http://www.w3.org/2000/svg", 
          className: "h-4 w-4 mr-1", 
          fill: "none", 
          viewBox: "0 0 24 24", 
          stroke: "currentColor" 
        },
          React.createElement("path", { 
            strokeLinecap: "round", 
            strokeLinejoin: "round", 
            strokeWidth: 2, 
            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          })
        ),
        "ملاحظة: سيتم حفظ بيانات النشاط التطوعي كوصف عام في الملف الشخصي."
      );
    }
    return null;
  };

  // Apply common styling for form elements
  useEffect(() => {
    // Set uniform heights for MonthYearRangePicker to match AutoComplete
    const datePickers = document.querySelectorAll('.month-year-range-picker');
    datePickers.forEach((picker) => {
      if (picker instanceof HTMLElement) {
        picker.style.height = '40px'; // Match AutoComplete height
      }
    });
  }, []);

  return {
    getOptionByValue,
    renderSchemaWarning
  };
} 