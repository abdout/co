// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, phdMajors, generateCompletionYears } from "./constants";

// interface PhDProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const PHD_MAJORS: Option[] = phdMajors.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const PhD = ({
//   register,
//   errors,
//   setValue
// }: PhDProps) => {
//   // Track PhD completion status
//   const [phdCompleted, setPhdCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('phdInstitution', { required: "يرجى اختيار الجامعة" });
//     register('phdMajor', { required: "يرجى اختيار التخصص" });
//     register('phdCompletionYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for PhD selection
//   const phdSteps: SelectionStep[] = [
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
//       getOptions: () => PHD_MAJORS
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
//     setValue('phdInstitution', selections.institution.label);
//     setValue('phdMajor', selections.major.label);
//     setValue('phdCompletionYear', selections.completionYear.value);

//     setPhdCompleted(true);

//     // Dispatch event when all PhD fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'phd',
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
//       <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
      
//       {/* Show error messages */}
//       {(errors.phdInstitution || errors.phdMajor || errors.phdCompletionYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.phdInstitution && <p>{errors.phdInstitution.message}</p>}
//           {errors.phdMajor && <p>{errors.phdMajor.message}</p>}
//           {errors.phdCompletionYear && <p>{errors.phdCompletionYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for PhD information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={phdSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default PhD; 