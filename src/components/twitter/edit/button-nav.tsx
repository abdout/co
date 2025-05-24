'use client';
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useTransition, useEffect } from "react";
import { useFormContext } from './form-context';
import { getNextRoute, getPreviousRoute } from './utils';

// Custom event to trigger form submission
export const triggerFormSubmit = () => {
    console.log('Dispatching global form submit event');
    // Create and dispatch a custom event
    const submitEvent = new Event('submit-form', { bubbles: true });
    window.dispatchEvent(submitEvent);
    
    // Try the global function approach as well
    try {
        if (typeof window !== 'undefined') {
            const w = window as Window & { 
                submitInformationForm?: () => boolean,
                submitEducationForm?: () => boolean 
            };
            
            if (typeof w.submitInformationForm === 'function') {
                console.log('Using global information submit function');
                w.submitInformationForm?.();
                return true;
            }
            
            if (typeof w.submitEducationForm === 'function') {
                console.log('Using global education submit function');
                w.submitEducationForm?.();
                return true;
            }
        }
    } catch (e) {
        console.error('Error calling global submit function:', e);
    }
    
    return false;
};

const ButtonNavigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    
    // Always use the hook unconditionally at the top level
    const formContextValue = useFormContext();
    
    // Then safely handle the potential null case
    const formRef = formContextValue?.formRef || null;
    const currentFormId = formContextValue?.currentFormId || null;
    
    // Determine if we're on the education page
    const isEducationPage = pathname === '/onboarding/education';

    // Debug log the formRef and currentFormId when they change
    useEffect(() => {
        console.log('ButtonNav: formRef updated:', !!formRef?.current);
        console.log('ButtonNav: currentFormId:', currentFormId);
    }, [formRef, currentFormId]);

    const handleNext = async () => {
        console.log('Next button clicked, formRef:', formRef?.current);
        console.log('Current form ID:', currentFormId);
        console.log('Current pathname:', pathname);
        
        // Handle terms form submission first
        if (pathname === '/onboarding/terms') {
            if (typeof window !== 'undefined' && 
                typeof (window as Window & { submitTermsForm?: () => boolean }).submitTermsForm === 'function') {
                console.log('Using terms form submission handler');
                const success = (window as Window & { submitTermsForm?: () => boolean }).submitTermsForm?.();
                if (!success) {
                    console.log('Terms form submission failed');
                    return; // Exit early if terms not accepted
                }
            }
            return; // Always return after handling terms
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
                    return;
                }
                
                // Check for information form
                if (currentFormId === 'information' && 
                    typeof window !== 'undefined' && 
                    typeof (window as Window & { submitInformationForm?: () => boolean }).submitInformationForm === 'function') {
                    console.log('Using global submit function for information form');
                    if ((window as Window & { submitInformationForm?: () => boolean }).submitInformationForm?.()) {
                        return;
                    }
                }
                
                // Check for education form - try both by ID and by current pathname
                if ((currentFormId === 'education-form' || isEducationPage) && 
                    typeof window !== 'undefined' && 
                    typeof (window as Window & { submitEducationForm?: () => boolean }).submitEducationForm === 'function') {
                    console.log('Using global submit function for education form');
                    if ((window as Window & { submitEducationForm?: () => boolean }).submitEducationForm?.()) {
                        return;
                    }
                }
                
                // If we're on the education page, try to find and click the education submit button directly
                if (isEducationPage) {
                    console.log('On education page, looking for submit-education button');
                    const educationSubmitButton = document.querySelector('#submit-education') as HTMLButtonElement;
                    if (educationSubmitButton) {
                        console.log('Found education submit button, clicking it');
                        educationSubmitButton.click();
                        return;
                    }
                }
                
                // Use requestSubmit() as a fallback
                const formElement = formRef.current as HTMLFormElement;
                console.log('Using requestSubmit on form');
                formElement.requestSubmit();
                console.log('Form submission requested');
                return;
            } catch (error) {
                console.error('Error submitting form:', error);
            }
            
            // Fallback to the submit button if requestSubmit fails
            let submitButtonId = `#submit-${currentFormId}`;
            
            // If we're on the education page, try the fixed ID
            if (isEducationPage) {
                submitButtonId = '#submit-education';
            }
            
            const submitButton = formRef.current.querySelector(submitButtonId) as HTMLButtonElement;
            
            if (submitButton) {
                console.log(`Clicking submit button ${submitButtonId}`);
                try {
                    submitButton.click();
                    return;
                } catch (clickError) {
                    console.error('Error clicking submit button:', clickError);
                }
            } else {
                console.error(`Submit button ${submitButtonId} not found`);
            }
        } else {
            console.warn('Form reference is null or undefined');
        }
        
        // If all else fails, just navigate to the next route
        startTransition(() => {
            const nextRoute = getNextRoute(pathname);
            console.log('Failed to submit form, navigating to:', nextRoute);
            toast.info('Navigating to next step');
            router.push(nextRoute);
        });
    };

    const handlePrevious = () => {
        const prevRoute = getPreviousRoute(pathname);
        router.push(prevRoute);
    };

    return (
        <div className="flex justify-center space-x-reverse space-x-3">
            <Button 
                onClick={handlePrevious}
                size="sm" 
                className='px-3 bg-foreground hover:bg-foreground/90'
            >
                <ArrowRight className=" h-4 w-4" /> السابق
            </Button>
            <Button 
                onClick={handleNext}
                variant="outline" 
                size="sm"
                disabled={isPending}
                className='px-3'
            >
                {isPending ? "جاري الحفظ..." : "التالي"} 
                <ArrowLeft className=" h-4 w-4" />
            </Button>
        </div>
    );
};

export default ButtonNavigation;



