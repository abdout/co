// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, masterMajors, generateCompletionYears } from "./constants";

// interface MasterProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const MASTER_MAJORS: Option[] = masterMajors.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const Master = ({
//   register,
//   errors,
//   setValue
// }: MasterProps) => {
//   // Track master completion status
//   const [masterCompleted, setMasterCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('masterInstitution', { required: "يرجى اختيار الجامعة" });
//     register('masterMajor', { required: "يرجى اختيار التخصص" });
//     register('masterCompletionYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for master selection
//   const masterSteps: SelectionStep[] = [
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
//       getOptions: () => MASTER_MAJORS
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
//     setValue('masterInstitution', selections.institution.label);
//     setValue('masterMajor', selections.major.label);
//     setValue('masterCompletionYear', selections.completionYear.value);

//     setMasterCompleted(true);

//     // Dispatch event when all Master fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'master',
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
//       <p className="text-sm font-semibold mb-2">بيانات الماجستير:</p>
      
//       {/* Show error messages */}
//       {(errors.masterInstitution || errors.masterMajor || errors.masterCompletionYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.masterInstitution && <p>{errors.masterInstitution.message}</p>}
//           {errors.masterMajor && <p>{errors.masterMajor.message}</p>}
//           {errors.masterCompletionYear && <p>{errors.masterCompletionYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for master information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={masterSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Master; 