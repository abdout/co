// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, professorMajors, generateCompletionYears } from "./constants";

// interface ProfessorProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const PROFESSOR_MAJORS: Option[] = professorMajors.map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
//   value: item.value,
//   label: item.label
// } as Option));

// const Professor = ({
//   register,
//   errors,
//   setValue
// }: ProfessorProps) => {
//   // Track professor completion status
//   const [professorCompleted, setProfessorCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('professorInstitution', { required: "يرجى اختيار الجامعة" });
//     register('professorMajor', { required: "يرجى اختيار التخصص" });
//     register('professorCompletionYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for professor selection
//   const professorSteps: SelectionStep[] = [
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
//       getOptions: () => PROFESSOR_MAJORS
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
//     setValue('professorInstitution', selections.institution.label);
//     setValue('professorMajor', selections.major.label);
//     setValue('professorCompletionYear', selections.completionYear.value);

//     setProfessorCompleted(true);

//     // Dispatch event when all Professor fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'professor',
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
//       <p className="text-sm font-semibold mb-2">بيانات الأستاذية:</p>
      
//       {/* Show error messages */}
//       {(errors.professorInstitution || errors.professorMajor || errors.professorCompletionYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.professorInstitution && <p>{errors.professorInstitution.message}</p>}
//           {errors.professorMajor && <p>{errors.professorMajor.message}</p>}
//           {errors.professorCompletionYear && <p>{errors.professorCompletionYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for professor information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={professorSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Professor; 