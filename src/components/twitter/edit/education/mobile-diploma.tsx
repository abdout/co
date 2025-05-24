// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, diplomaMajors, generateCompletionYears } from "./constants";

// interface DiplomaProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// }));

// const DIPLOMA_MAJORS: Option[] = diplomaMajors.map(item => ({
//   value: item.value,
//   label: item.label
// }));

// const COMPLETION_YEARS: Option[] = generateCompletionYears();

// const Diploma = ({
//   register,
//   errors,
//   setValue
// }: DiplomaProps) => {
//   // Track diploma completion status
//   const [diplomaCompleted, setDiplomaCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('diplomaInstitution', { required: "يرجى اختيار الجامعة" });
//     register('diplomaMajor', { required: "يرجى اختيار التخصص" });
//     register('diplomaCompletionYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for diploma selection
//   const diplomaSteps: SelectionStep[] = [
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
//       getOptions: () => DIPLOMA_MAJORS
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
//     setValue('diplomaInstitution', selections.institution.label);
//     setValue('diplomaMajor', selections.major.label);
//     setValue('diplomaCompletionYear', selections.completionYear.value);

//     setDiplomaCompleted(true);

//     // Dispatch event when all Diploma fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'diploma',
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
//       <p className="text-sm font-semibold mb-2">بيانات الدبلوم:</p>
      
//       {/* Show error messages */}
//       {(errors.diplomaInstitution || errors.diplomaMajor || errors.diplomaCompletionYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.diplomaInstitution && <p>{errors.diplomaInstitution.message}</p>}
//           {errors.diplomaMajor && <p>{errors.diplomaMajor.message}</p>}
//           {errors.diplomaCompletionYear && <p>{errors.diplomaCompletionYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for diploma information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={diplomaSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Diploma; 