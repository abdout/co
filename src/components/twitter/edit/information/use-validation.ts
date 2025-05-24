import { useRef, useEffect } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface ValidationProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  errorFields: (keyof T)[];
  errorMessage: string;
  defaultValues?: Partial<T>;
  currentValues?: Partial<T>;
  toastStyle?: Record<string, string>;
}

export function useFormValidation<T extends FieldValues>({ 
  errors, 
  errorFields, 
  errorMessage,
  defaultValues,
  currentValues,
  toastStyle = { background: 'rgb(239 68 68)', color: 'white', border: 'none' }
}: ValidationProps<T>) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Check if any data exists (previous or current)
  const checkForExistingData = () => {
    // Check if any default values exist
    const hasExistingData = defaultValues && errorFields.some(
      field => {
        const key = field as string;
        return defaultValues[key as keyof typeof defaultValues] != null && 
               defaultValues[key as keyof typeof defaultValues] !== '';
      }
    );
    
    // Check if any current values exist
    const hasCurrentData = currentValues && errorFields.some(
      field => {
        const key = field as string;
        return currentValues[key] != null && currentValues[key] !== '';
      }
    );
    
    return hasExistingData || hasCurrentData;
  };
  
  // Watch for errors and show toast/scroll if needed
  useEffect(() => {
    const hasErrors = errorFields.some(field => errors[field]);
    
    if (hasErrors && !checkForExistingData()) {
      toast.error(errorMessage, { style: toastStyle });
      
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [errors, errorFields, errorMessage]);
  
  return { sectionRef };
} 