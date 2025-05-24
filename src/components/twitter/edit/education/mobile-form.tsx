// 'use client';
// import { useState, useTransition, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "sonner";
// import { informationSchema } from "./validation";
// import { createInformation, updateInformation } from "./action";
// import type { InformationSchema } from "./validation";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useFormContext } from '@/components/onboarding/form-context';
// import { getNextRoute } from '../utils';
// import Name from "./name";
// import Location from "./location";
// import Birthdate from "./birthdate";
// import DegreeSelector from "./mobile-degree-selector";
// import Degree from "./mobile-degree";

// // Add this at the top of the file, after the imports
// declare global {
//   interface Window {
//     submitInformationForm?: () => boolean;
//   }
// }

// interface FormProps {
//   type: "create" | "update";
//   data?: InformationSchema;
// }

// const Form = ({ type, data }: FormProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isPending, startTransition] = useTransition();
//   const locationSectionRef = useRef<HTMLDivElement>(null);
//   const bioSectionRef = useRef<HTMLDivElement>(null);
  
//   // Always use the hook unconditionally at the top level
//   const formContextValue = useFormContext();
  
//   // Then safely handle the potential null case
//   const formRef = formContextValue?.formRef;
//   const setIsSubmitting = formContextValue?.setIsSubmitting;
//   const setCurrentFormId = formContextValue?.setCurrentFormId;
  
//   // Set up local form ref that we'll sync with context
//   const localFormRef = useRef<HTMLFormElement>(null);
  
//   // Education level state
//   const [educationLevel, setEducationLevel] = useState<string>('student');

//   // Add state for local storage data
//   const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     watch,
//     reset
//   } = useForm<InformationSchema>({
//     resolver: zodResolver(informationSchema),
//     defaultValues: data,
//   });

//   // Watch location and birthdate fields
//   const locationFields = watch(['currentCountry', 'currentState', 'currentLocality', 'currentAdminUnit', 'currentNeighborhood']);
//   const birthdateFields = watch(['birthCountry', 'birthState', 'birthLocality', 'birthYear', 'birthMonth']);

//   useEffect(() => {
//     // Check if all location fields are filled
//     const isLocationComplete = locationFields.every(field => field);
    
//     // Check if all birthdate fields are filled
//     const isBirthdateComplete = birthdateFields.every(field => field);

//     // If both sections are complete, scroll to bio section
//     if (isLocationComplete && isBirthdateComplete) {
//       const timer = setTimeout(() => {
//         if (bioSectionRef.current) {
//           bioSectionRef.current.scrollIntoView({
//             behavior: 'smooth',
//             block: 'start'
//           });
//         }
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [locationFields, birthdateFields, bioSectionRef]);

//   // Load form values when data prop changes (e.g., when data is fetched from the server)
//   useEffect(() => {
//     if (data && Object.keys(data).length > 0) {
//       console.log('Server data received:', data);
      
//       // Reset form with server data, giving it priority over localStorage
//       reset(data);
      
//       // If education level is provided, update state
//       if (data.educationLevel) {
//         setEducationLevel(data.educationLevel);
//       }
      
//       // toast.success('Loaded data from server');
      
//       // Also save to localStorage to ensure consistency
//       try {
//         localStorage.setItem('informationFormData', JSON.stringify(data));
//         console.log('Saved server data to localStorage for later use');
//       } catch (error) {
//         console.error('Error saving server data to localStorage:', error);
//       }
//     } else if (!data && !localStorageLoaded) {
//       // If no server data, try to load from localStorage
//       try {
//         const savedData = localStorage.getItem('informationFormData');
//         if (savedData) {
//           const parsedData = JSON.parse(savedData);
//           console.log('No server data, loading from localStorage:', parsedData);
          
//           // Reset form with localStorage data
//           reset(parsedData);
          
//           // If education level is stored, update state
//           if (parsedData.educationLevel) {
//             setEducationLevel(parsedData.educationLevel);
//           }
          
//           toast.success("Loaded previously saved data");
//         }
//       } catch (error) {
//         console.error('Error loading from localStorage:', error);
//       }
      
//       setLocalStorageLoaded(true);
//     }
//   }, [data, reset, localStorageLoaded, setLocalStorageLoaded]);

//   // Register form in global window for debug access
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       window.submitInformationForm = () => {
//         console.log('Global submit function called');
//         if (localFormRef.current) {
//           console.log('Submitting form via global function');
//           const submitButton = localFormRef.current.querySelector('#submit-information') as HTMLButtonElement;
//           if (submitButton) {
//             submitButton.click();
//             return true;
//           }
//         }
//         return false;
//       };
      
//       return () => {
//         delete window.submitInformationForm;
//       };
//     }
//   }, [localFormRef]);

//   useEffect(() => {
//     // Set form reference for ButtonNavigation if context is available
//     if (formRef && localFormRef.current) {
//       try {
//         formRef.current = localFormRef.current;
//         console.log('Form reference set successfully', formRef.current);
//       } catch {
//         console.error('Error setting form reference:');
//       }
//     }
    
//     try {
//       setCurrentFormId?.('information');
//     } catch {
//       console.log('Unable to set current form ID');
//     }
    
//     // Set education level to student as default and update form value
//     setValue('educationLevel', 'student');
//   }, [formRef, setCurrentFormId, setValue]);

//   // Add this function before onSubmitHandler
//   const scrollToFirstError = () => {
//     // Get the first error field
//     const firstErrorField = Object.keys(errors)[0];
//     if (!firstErrorField) return;

//     // Find the element with the error
//     const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
//     if (errorElement) {
//       errorElement.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'center'
//       });
//     }
//   };

//   // Handle the actual form submission logic
//   const onSubmitHandler = (formData: InformationSchema) => {
//     console.log('Form submission triggered with data:', formData);
    
//     // Get all validation errors
//     const errorFields = Object.keys(errors);
//     if (errorFields.length > 0) {
//       console.error('Form has validation errors:', errors);
      
//       // Create a detailed error message in Arabic
//       let errorMessage = 'يرجى تصحيح الأخطاء التالية:';
      
//       // Add specific field errors to the message
//       errorFields.forEach(field => {
//         const fieldError = errors[field as keyof typeof errors];
//         if (fieldError) {
//           // Map field names to Arabic
//           let arabicFieldName = '';
//           switch(field) {
//             case 'fullName': arabicFieldName = 'الاسم الكامل'; break;
//             case 'birthCountry': arabicFieldName = 'دولة الميلاد'; break;
//             case 'birthState': arabicFieldName = 'ولاية الميلاد'; break;
//             case 'birthLocality': arabicFieldName = 'محلية الميلاد'; break;
//             case 'birthYear': arabicFieldName = 'سنة الميلاد'; break;
//             case 'birthMonth': arabicFieldName = 'شهر الميلاد'; break;
//             case 'currentCountry': arabicFieldName = 'الدولة الحالية'; break;
//             case 'currentState': arabicFieldName = 'الولاية الحالية'; break;
//             case 'currentLocality': arabicFieldName = 'المحلية الحالية'; break;
//             case 'currentAdminUnit': arabicFieldName = 'الوحدة الإدارية'; break;
//             case 'currentNeighborhood': arabicFieldName = 'الحي'; break;
//             case 'educationLevel': arabicFieldName = 'المستوى التعليمي'; break;
//             case 'educationField': arabicFieldName = 'مجال الدراسة'; break;
//             case 'educationSpecialization': arabicFieldName = 'التخصص'; break;
//             default: arabicFieldName = field;
//           }
          
//           errorMessage += `\n• ${arabicFieldName}`;
//         }
//       });
      
//       // Show toast with detailed error message and red styling
//       toast.error(errorMessage, {
//         style: {
//           background: 'rgb(239 68 68)',
//           color: 'white',
//           border: 'none',
//           textAlign: 'right',
//           direction: 'rtl'
//         },
//         duration: 5000 // Show for 5 seconds to give user time to read
//       });
      
//       // Log all error fields to console
//       errorFields.forEach(field => {
//         const fieldError = errors[field as keyof typeof errors];
//         if (fieldError) {
//           console.error(`Field ${field} error:`, fieldError.message);
//         }
//       });
      
//       // Scroll to the first error
//       scrollToFirstError();
      
//       return;
//     }
    
//     // Ensure birthYear and birthMonth are strings before submission
//     const processedFormData = {
//       ...formData,
//       birthYear: formData.birthYear?.toString() || '',
//       birthMonth: formData.birthMonth?.toString() || ''
//     };
    
//     // Save to localStorage for persistence between page visits
//     try {
//       localStorage.setItem('informationFormData', JSON.stringify(processedFormData));
//       console.log('Saved form data to localStorage');
//     } catch (error) {
//       console.error('Error saving to localStorage:', error);
//     }
    
//     startTransition(async () => {
//       try {
//         console.log('Starting form submission transition');
//         if (setIsSubmitting) {
//           console.log('Setting isSubmitting to true');
//           setIsSubmitting(true);
//         }
        
//         const minimalData = {
//           ...processedFormData,
//         };

//         console.log("Submitting minimal data:", minimalData);

//         console.log('Form submission type:', type);

//         if (type === "create") {
//           console.log('Creating information...');
//           try {
//             // Instead of FormData, pass the object directly for clarity
//             console.log('Calling createInformation with:', minimalData);
            
//             // Call the server action directly with the data object
//             const result = await createInformation({ success: false, error: false }, minimalData);
//             console.log('Create information result:', result);

//             if (result.success) {
//               console.log('Information created successfully');
//               toast.success("تم تحديث البيانات بنجاح");
//               router.push(getNextRoute(pathname));
//             } else {
//               console.error('Failed to create information');
//               toast.error(result.error || "Failed to create information");
//             }
//           } catch (error) {
//             console.error('Error during creation:', error);
//             toast.error("An error occurred during form submission");
//           }
//         } else {
//           console.log('Updating information...');
//           try {
//             // Instead of FormData, pass the object directly for clarity
//             console.log('Calling updateInformation with:', minimalData);
            
//             // Call the server action directly with the data object
//             const result = await updateInformation({ success: false, error: false }, minimalData);
//             console.log('Update information result:', result);

//             if (result.success) {
//               console.log('Information updated successfully');
//               toast.success("تم تحديث البيانات بنجاح");
//               router.push(getNextRoute(pathname));
//             } else {
//               console.error('Failed to update information');
//               toast.error(result.error || "Failed to update information");
//             }
//           } catch (error) {
//             console.error('Error during update:', error);
//             toast.error("An error occurred during form submission");
//           }
//         }
//       } catch (error) {
//         console.error("Form submission error:", error);
//         toast.error("An error occurred while submitting the form");
//       } finally {
//         console.log('Form submission completed');
//         if (setIsSubmitting) {
//           console.log('Setting isSubmitting to false');
//           setIsSubmitting(false);
//         }
//       }
//     });
//   };

 

//   return (
//     <form
    
//       ref={localFormRef}
//       onSubmit={handleSubmit(onSubmitHandler)}
//       className="h-[22rem] flex flex-col -mt-2 mx-auto"
//       noValidate
//     >
//       <ScrollArea className="">
//         <div dir="rtl" className="flex flex-col gap-6 px-6  mx-auto ">
//           <div>
//             <Name register={register} errors={errors} />
//           </div>
//           {/* <div>
//             <ID register={register} errors={errors} setValue={setValue} watch={watch} />
//           </div> */}
          
//           {/* Use a grid layout with lower gap and additional container styling */}
//           <div 
//             ref={locationSectionRef} 
//             className="flex flex-col gap-6"
//           >
//             <div dir="rtl" className="flex flex-col gap-6">
//               <div className="relative">
//                 <Location
//                   register={register}
//                   errors={errors}
//                   setValue={setValue}
//                   defaultValues={data}
//                 />
//               </div>
              
//               <div className="relative">
//                 <Birthdate
//                   register={register}
//                   errors={errors}
//                   setValue={setValue}
//                   watch={watch}
//                   defaultValues={data}
//                 />
//               </div>
//             </div>

//             {/* <div ref={bioSectionRef}>
//               <Bio register={register} errors={errors} />
//             </div> */}
//           </div>

//           <div className="pt-6">
//             <DegreeSelector 
//               setValue={setValue} 
//               educationLevel={educationLevel} 
//               setEducationLevel={setEducationLevel} 
//             />      
//           </div>
//           {educationLevel && (
//             <div>
//               <Degree
//                 register={register}
//                 errors={errors}
//                 setValue={setValue}
//                 educationLevel={educationLevel}
//               />
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Submit button */}
//       <button 
//         id="submit-information" 
//         type="submit" 
//         disabled={isPending}
//         style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
//       >
//         Submit Form
//       </button>
//     </form>
//   );
// };

// export default Form; 