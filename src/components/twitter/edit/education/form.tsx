'use client';
import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { informationSchema } from "./validation";
import type { InformationSchema } from "./validation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormContext } from '@/components/twitter/edit/form-context';
import Name from "./name";
import Location from "./location";
import Birthdate from "./birthdate";
import DegreeSelector from "./degree-selector";
import Degree from "./degree";
import { useSubmit } from './use-submit';
import { useFormInit } from './use-init';
import { useScrollLocationBirthdate } from './use-scroll-location-birthdate';


// Add this at the top of the file, after the imports
declare global {
  interface Window {
    submitInformationForm?: () => boolean;
  }
}

interface FormProps {
  type: "create" | "update";
  data?: InformationSchema;
}

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Default to false on server, true if window exists and we're on a device that can run JavaScript
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
};

// Simple deep equal function without external dependencies - commented out as it's currently unused
// function deepEqual<T>(a: T, b: T): boolean {
//   if (a === b) return true;
//   
//   if (a === null || b === null || 
//       typeof a !== 'object' || typeof b !== 'object') {
//     return false;
//   }
//   
//   if (Array.isArray(a) && Array.isArray(b)) {
//     if (a.length !== b.length) return false;
//     for (let i = 0; i < a.length; i++) {
//       if (!deepEqual(a[i], b[i])) return false;
//     }
//     return true;
//   }
//   
//   const keysA = Object.keys(a);
//   const keysB = Object.keys(b);
//   
//   if (keysA.length !== keysB.length) return false;
//   
//   for (const key of keysA) {
//     if (!keysB.includes(key)) return false;
//     if (!deepEqual(a[key], b[key])) return false;
//   }
//   
//   return true;
// }

const Form = ({ type, data }: FormProps) => {
  const [isPending] = useTransition();
  
  // Always use the hook unconditionally at the top level
  const formContextValue = useFormContext();
  
  // Then safely handle the potential null case
  const formRef = formContextValue?.formRef;
  const setIsSubmitting = formContextValue?.setIsSubmitting;
  const setCurrentFormId = formContextValue?.setCurrentFormId;
  
  // Set up local form ref that we'll sync with context
  const localFormRef = useRef<HTMLFormElement>(null);
  
  // Education level state
  const [educationLevel, setEducationLevel] = useState<string>('student');
  
  // Check if we're on a mobile device
  const isMobile = !useMediaQuery("(min-width: 768px)");
  console.log('[FormDebug] isMobile:', isMobile);
  
  // Add isInitialRender ref at the top level of the component
  const isInitialRender = useRef(true);
  
  // Update isInitialRender after the first render
  useEffect(() => {
    // Set isInitialRender to false after the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset
  } = useForm<InformationSchema>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

  // Use our form initialization hook
  const { } = useFormInit({
    data,
    reset,
    setEducationLevel,
    setCurrentFormId,
    setValue
  });

  // Use our location-birthdate scroll hook
  const isPrefilledData = !!data && !isInitialRender.current;
  console.log('[FormDebug] isPrefilledData:', isPrefilledData, '!!data:', !!data, '!isInitialRender.current:', !isInitialRender.current);
  
  const { 
    locationRef, 
    birthdateRef,
    locationComplete,
    birthdateComplete
  } = useScrollLocationBirthdate({
    watch,
    isPrefilledData
  });
  
  // Log focus and scroll refs for debugging
  useEffect(() => {
    console.log('[FormDebug] Focus refs initialized:', {
      locationRef: !!locationRef.current,
      birthdateRef: !!birthdateRef.current,
      locationComplete,
      birthdateComplete
    });
    
    // Add a click handler to document to monitor user interactions
    const documentClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log('[FormDebug] Document click:', {
        element: target.tagName,
        className: target.className,
        locationContains: locationRef.current?.contains(target),
        birthdateContains: birthdateRef.current?.contains(target),
        hasLocationDataAttr: !!target.closest('[data-location-field="true"]'),
        hasBirthdateDataAttr: !!target.closest('[data-birthdate-field="true"]')
      });
    };
    
    document.addEventListener('click', documentClickHandler);
    
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
  }, [locationRef.current, birthdateRef.current, locationComplete, birthdateComplete]);

  // Set form reference for ButtonNavigation if context is available
  if (formRef && localFormRef.current) {
    formRef.current = localFormRef.current;
  }

  // Use our custom submit hook
  const { onSubmit } = useSubmit({ 
    handleSubmit, 
    errors, 
    type, 
    setIsSubmitting 
  });

  return (
    <form
      ref={localFormRef}
      onSubmit={onSubmit}
      className="p-2 h-[24rem] md:h-[13rem] flex flex-col mx-0 md:mx-auto"
      noValidate
    >
      <ScrollArea>
        <div dir="rtl" className="flex flex-col gap-6 px-6 w-full">
          {/* <div>
            <Name register={register} errors={errors} />
          </div> */}
          
          <div className="flex flex-col gap-6">
            {/* <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative" ref={locationRef}>
                <Location
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  defaultValues={data}
                />
              </div>
              
              <div className="relative" ref={birthdateRef}>
                <Birthdate
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  defaultValues={data}
                />
              </div>
            </div> */}

            <div className="pt-6">
              <DegreeSelector 
                setValue={setValue} 
                educationLevel={educationLevel} 
                setEducationLevel={setEducationLevel} 
              />      
            </div>
            {educationLevel && (
              <div>
                <Degree
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  educationLevel={educationLevel}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <button 
        id="submit-information" 
        type="submit" 
        disabled={isPending}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      >
        Submit Form
      </button>
    </form>
  );
};

export default Form; 