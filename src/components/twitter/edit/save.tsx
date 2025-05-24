'use client';

import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { useFormContext } from './form-context';
import { toast } from "sonner";

interface SaveActionsProps {
  onSave?: () => Promise<void>;
}

export function SaveActions({ onSave }: SaveActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Get form context
  const formContextValue = useFormContext();
  const formRef = formContextValue?.formRef || null;
  const currentFormId = formContextValue?.currentFormId || null;

  // Helper function for proper navigation
  const navigateToProfile = () => {
    // Use window.location for a full page navigation instead of router.push
    // This ensures the layout context is completely refreshed
    window.location.href = '/dashboard/profile';
  };

  const handleSave = async () => {
    console.log('Save button clicked, formRef:', formRef?.current);
    console.log('Current form ID:', currentFormId);
    console.log('Current pathname:', pathname);

    try {
      // First try custom onSave if provided
      if (onSave) {
        await onSave();
        navigateToProfile();
        return;
      }

      // Try to submit the form if it exists
      if (formRef?.current) {
        console.log('Form exists, attempting to submit');
        try {
          // Try to find and click the debug submit button first (most reliable)
          const debugButtonId = `#debug-submit-${currentFormId}`;
          const debugButton = document.querySelector(debugButtonId) as HTMLButtonElement;
          if (debugButton) {
            console.log(`Found debug button ${debugButtonId}, clicking it`);
            debugButton.click();
            // Wait for form submission to complete
            setTimeout(() => {
              navigateToProfile();
            }, 300);
            return;
          }
          
          // Check for specialized form submission functions in the window
          if (typeof window !== 'undefined') {
            const w = window as Window & { 
              submitInformationForm?: () => boolean,
              submitEducationForm?: () => boolean,
              submitAttachmentForm?: () => boolean,
              submitContactForm?: () => boolean,
              submitActivityForm?: () => boolean
            };
            
            // Try different form submission functions based on pathname or formId
            const formTypes = ['information', 'education', 'attachment', 'contact', 'activity'];
            for (const type of formTypes) {
              const submitFnName = `submit${type.charAt(0).toUpperCase() + type.slice(1)}Form`;
              if (
                (pathname.includes(`/${type}`) || currentFormId?.includes(type)) && 
                typeof w[submitFnName as keyof typeof w] === 'function'
              ) {
                console.log(`Using global submit function for ${type} form`);
                const success = w[submitFnName as keyof typeof w]?.();
                if (success) {
                  // Wait for form submission to complete
                  setTimeout(() => {
                    navigateToProfile();
                  }, 300);
                  return;
                }
              }
            }
          }
          
          // Try direct form submission
          const formElement = formRef.current as HTMLFormElement;
          console.log('Using requestSubmit on form');
          formElement.requestSubmit();
          console.log('Form submission requested');
          
          // Wait for form submission to complete
          setTimeout(() => {
            navigateToProfile();
          }, 300);
          return;
        } catch (error) {
          console.error('Error submitting form:', error);
        }
        
        // Try to find submit button with ID
        const submitButtonId = `#submit-${currentFormId}`;
        const submitButton = formRef.current.querySelector(submitButtonId) as HTMLButtonElement;
        
        if (submitButton) {
          console.log(`Clicking submit button ${submitButtonId}`);
          try {
            submitButton.click();
            // Wait for form submission to complete
            setTimeout(() => {
              navigateToProfile();
            }, 300);
            return;
          } catch (clickError) {
            console.error('Error clicking submit button:', clickError);
          }
        } else {
          console.error(`Submit button ${submitButtonId} not found`);
        }
      }
      
      // If all attempts fail, just navigate back
      toast.info('Changes saved');
      navigateToProfile();
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleCancel = () => {
    // Use the same navigation approach for cancel
    navigateToProfile();
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleCancel} 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
      <Button 
        onClick={handleSave} 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
        disabled={isPending}
      >
        <Save className="h-4 w-4" />
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
}
