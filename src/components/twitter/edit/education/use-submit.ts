import { useTransition } from "react";
import { UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { InformationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import { getNextRoute } from '../utils';
import { ErrorToast, SuccessToast, showValidationErrorToast } from "@/components/atom/toast";

interface UseSubmitProps {
  handleSubmit: UseFormHandleSubmit<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  type: "create" | "update";
  setIsSubmitting?: (value: boolean) => void;
}

export function useSubmit({ 
  handleSubmit, 
  errors, 
  type, 
  setIsSubmitting 
}: UseSubmitProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Scroll to the first error field
  const scrollToFirstError = () => {
    // Get the first error field
    const firstErrorField = Object.keys(errors)[0];
    if (!firstErrorField) return;

    // Find the element with the error
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Handle form validation errors
  const handleValidationErrors = () => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return false;

    console.error('Form has validation errors:', errors);
    
    // Create a detailed error message in Arabic
    let errorMessage = 'يرجى تصحيح الأخطاء التالية:';
    
    // Add specific field errors to the message
    errorFields.forEach(field => {
      const fieldError = errors[field as keyof typeof errors];
      if (fieldError) {
        // Map field names to Arabic
        let arabicFieldName = '';
        switch(field) {
          case 'fullName': arabicFieldName = 'الاسم الكامل'; break;
          case 'birthCountry': arabicFieldName = 'دولة الميلاد'; break;
          case 'birthState': arabicFieldName = 'ولاية الميلاد'; break;
          case 'birthLocality': arabicFieldName = 'محلية الميلاد'; break;
          case 'birthYear': arabicFieldName = 'سنة الميلاد'; break;
          case 'birthMonth': arabicFieldName = 'شهر الميلاد'; break;
          case 'currentCountry': arabicFieldName = 'الدولة الحالية'; break;
          case 'currentState': arabicFieldName = 'الولاية الحالية'; break;
          case 'currentLocality': arabicFieldName = 'المحلية الحالية'; break;
          case 'currentAdminUnit': arabicFieldName = 'الوحدة الإدارية'; break;
          case 'currentNeighborhood': arabicFieldName = 'الحي'; break;
          case 'educationLevel': arabicFieldName = 'المستوى التعليمي'; break;
          case 'educationField': arabicFieldName = 'مجال الدراسة'; break;
          case 'educationSpecialization': arabicFieldName = 'التخصص'; break;
          default: arabicFieldName = field;
        }
        
        errorMessage += `\n• ${arabicFieldName}`;
      }
    });
    
    // Show toast with detailed error message using ErrorToast
    showValidationErrorToast(errorMessage);
    
    // Log all error fields to console
    errorFields.forEach(field => {
      const fieldError = errors[field as keyof typeof errors];
      if (fieldError) {
        console.error(`Field ${field} error:`, fieldError.message);
      }
    });
    
    // Scroll to the first error
    scrollToFirstError();
    
    return true;
  };

  // Handle the actual form submission
  const onSubmit = handleSubmit((formData: InformationSchema) => {
    console.log('Form submission triggered with data:', formData);
    
    // Check for validation errors
    if (handleValidationErrors()) {
      return;
    }
    
    // Ensure birthYear and birthMonth are strings before submission
    const processedFormData = {
      ...formData,
      birthYear: formData.birthYear?.toString() || '',
      birthMonth: formData.birthMonth?.toString() || ''
    };
    
    // Save to localStorage for persistence between page visits
    try {
      localStorage.setItem('informationFormData', JSON.stringify(processedFormData));
      console.log('Saved form data to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    startTransition(async () => {
      try {
        console.log('Starting form submission transition');
        if (setIsSubmitting) {
          console.log('Setting isSubmitting to true');
          setIsSubmitting(true);
        }
        
        const minimalData = {
          ...processedFormData,
        };

        console.log("Submitting minimal data:", minimalData);
        console.log('Form submission type:', type);

        if (type === "create") {
          console.log('Creating information...');
          try {
            const result = await createInformation({ success: false, error: false }, minimalData);
            console.log('Create information result:', result);

            if (result.success) {
              console.log('Information created successfully');
              SuccessToast();
              router.push(getNextRoute(pathname));
            } else {
              console.error('Failed to create information');
              ErrorToast(result.error || "فشل في إنشاء المعلومات");
            }
          } catch (error) {
            console.error('Error during creation:', error);
            ErrorToast("حدث خطأ أثناء تقديم النموذج");
          }
        } else {
          console.log('Updating information...');
          try {
            const result = await updateInformation({ success: false, error: false }, minimalData);
            console.log('Update information result:', result);

            if (result.success) {
              console.log('Information updated successfully');
              SuccessToast();
              router.push(getNextRoute(pathname));
            } else {
              console.error('Failed to update information');
              ErrorToast(result.error || "فشل في تحديث المعلومات");
            }
          } catch (error) {
            console.error('Error during update:', error);
            ErrorToast("حدث خطأ أثناء تقديم النموذج");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        ErrorToast("حدث خطأ أثناء تقديم النموذج");
      } finally {
        console.log('Form submission completed');
        if (setIsSubmitting) {
          console.log('Setting isSubmitting to false');
          setIsSubmitting(false);
        }
      }
    });
  });

  return {
    onSubmit,
    isPending,
    scrollToFirstError
  };
} 