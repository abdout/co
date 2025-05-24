// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, bachelorMajors, generateCompletionYears } from "./constants";

// interface BachelorProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const BACHELOR_MAJORS: Option[] = bachelorMajors.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const Bachelor = ({
//   register,
//   errors,
//   setValue
// }: BachelorProps) => {
//   // Track bachelor completion status
//   const [bachelorCompleted, setBachelorCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('bachelorInstitution', { required: "يرجى اختيار الجامعة" });
//     register('bachelorMajor', { required: "يرجى اختيار التخصص" });
//     register('bachelorCompletionYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for bachelor selection
//   const bachelorSteps: SelectionStep[] = [
//     {
//       id: "institution",
//       title: "الجامعة",
//       placeholder: "اختر الجامعة",
//       emptyMessage: "لا توجد جامعات متاحة",
//       getOptions: () => INSTITUTIONS
//     },
//     {
//       id: "major",
//       title: "التخصص",
//       placeholder: "اختر التخصص",
//       emptyMessage: "لا توجد تخصصات متاحة",
//       getOptions: () => BACHELOR_MAJORS
//     },
//     {
//       id: "completionYear",
//       title: "سنة التخرج",
//       placeholder: "اختر السنة",
//       emptyMessage: "لا توجد سنوات متاحة",
//       getOptions: () => COMPLETION_YEARS
//     }
//   ];

//   // Handle completion of the hierarchical selection
//   const handleComplete = (selections: Record<string, Option>) => {
//     // Map the selections to the form values
//     setValue('bachelorInstitution', selections.institution.label);
//     setValue('bachelorMajor', selections.major.label);
//     setValue('bachelorCompletionYear', selections.completionYear.value);

//     setBachelorCompleted(true);

//     // Dispatch event when all Bachelor fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'bachelor',
//         fieldType: 'all'
//       }
//     });
//     document.dispatchEvent(event);
//   };

//   // Custom animation timing configurations
//   const timing = {
//     transitionDelay: 250,
//     dropdownDelay: 600
//   };

//   return (
//     <div className="space-y-4">
//       <p className="text-sm font-semibold mb-2">بيانات البكالوريوس:</p>
      
//       {/* Show error messages */}
//       {(errors.bachelorInstitution || errors.bachelorMajor || errors.bachelorCompletionYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.bachelorInstitution && <p>{errors.bachelorInstitution.message}</p>}
//           {errors.bachelorMajor && <p>{errors.bachelorMajor.message}</p>}
//           {errors.bachelorCompletionYear && <p>{errors.bachelorCompletionYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for bachelor information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={bachelorSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Bachelor; 