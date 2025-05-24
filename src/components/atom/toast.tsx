'use client';

import { toast } from 'sonner';

/**
 * Custom toast functions for consistent UI across the application
 */

/**
 * Shows a simple green checkmark circle toast without text
 */
export const SuccessToast = () => {
  toast.success('', {
    icon: <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="white" 
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>,
    duration: 1500,
    position: "bottom-right",
    style: {
      border: 'none',
      padding: '0px',
      background: 'transparent',
      boxShadow: 'none',
      minWidth: 'auto',
      minHeight: 'auto'
    }
  });
};

/**
 * Shows an error toast with Arabic text
 * @param message The error message to display
 */
export const ErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: 'rgb(239 68 68)',
      color: 'white',
      border: 'none',
      width: '220px',
      maxWidth: '220px'
    }
  });
};

/**
 * Shows a reusable delete success toast with customizable message
 * @param message The success message to display (defaults to "تم الحذف بنجاح")
 */
export const DeleteToast = (message: string = "تم الحذف بنجاح") => {
  toast.success(message, {
    style: {
      background: 'rgb(34 197 94)',
      color: 'white',
      border: 'none',
      width: '220px',
      maxWidth: '220px',
      textAlign: 'right'
    },
    duration: 2000,
    position: 'bottom-right'
  });
};

/**
 * Shows an info toast with custom styling
 * @param message The info message to display
 */
export const showInfoToast = (message: string) => {
  toast.info(message, {
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      width: '220px',
      maxWidth: '220px'
    }
  });
};

/**
 * Toast utility for form validation errors
 * @param message The validation error message to display
 */
export const showValidationErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: 'rgb(239 68 68)',
      color: 'white',
      border: 'none',
      width: '220px',
      maxWidth: '220px'
    }
  });
};
