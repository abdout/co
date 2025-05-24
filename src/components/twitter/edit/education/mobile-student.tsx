// 'use client';
// import { useState, useEffect } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Option } from "@/components/atom/auto-complete";
// import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
// import { institutions, faculties, studentYears } from "./constants";

// interface StudentProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// // Convert Item arrays to Option arrays
// const INSTITUTIONS: Option[] = institutions.map(item => ({
//   value: item.value,
//   label: item.label
// }));

// const FACULTIES: Option[] = faculties.map(item => ({
//   value: item.value,
//   label: item.label
// }));

// const STUDENT_YEARS: Option[] = studentYears.map(item => ({
//   value: item.value,
//   label: item.label
// }));

// const Student = ({
//   register,
//   errors,
//   setValue
// }: StudentProps) => {
//   // Add ref for the student section
//   const [studentCompleted, setStudentCompleted] = useState(false);

//   // Register all fields required by React Hook Form
//   useEffect(() => {
//     register('studentInstitution', { required: "يرجى اختيار الجامعة" });
//     register('studentFaculty', { required: "يرجى اختيار التخصص" });
//     register('studentYear', { required: "يرجى اختيار السنة" });
//   }, [register]);

//   // Define the hierarchical steps for student selection
//   const studentSteps: SelectionStep[] = [
//     {
//       id: "institution",
//       title: "الجامعة",
//       placeholder: "اختر الجامعة",
//       emptyMessage: "لا توجد جامعات متاحة",
//       getOptions: () => INSTITUTIONS
//     },
//     {
//       id: "faculty",
//       title: "التخصص",
//       placeholder: "اختر التخصص",
//       emptyMessage: "لا توجد تخصصات متاحة",
//       getOptions: () => FACULTIES
//     },
//     {
//       id: "year",
//       title: "السنة",
//       placeholder: "اختر السنة",
//       emptyMessage: "لا توجد سنوات متاحة",
//       getOptions: () => STUDENT_YEARS
//     }
//   ];

//   // Handle completion of the hierarchical selection
//   const handleComplete = (selections: Record<string, Option>) => {
//     // Map the selections to the form values
//     setValue('studentInstitution', selections.institution.label);
//     setValue('studentFaculty', selections.faculty.label);
//     setValue('studentYear', selections.year.value);

//     setStudentCompleted(true);

//     // Dispatch event when all Student fields are completed
//     const event = new CustomEvent('educationFieldCompleted', {
//       detail: {
//         componentType: 'student',
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
//       <p className="text-sm font-semibold mb-2">بيانات الدراسة:</p>
      
//       {/* Show error messages */}
//       {(errors.studentInstitution || errors.studentFaculty || errors.studentYear) && (
//         <div className="text-red-500 text-sm mb-2">
//           {errors.studentInstitution && <p>{errors.studentInstitution.message}</p>}
//           {errors.studentFaculty && <p>{errors.studentFaculty.message}</p>}
//           {errors.studentYear && <p>{errors.studentYear.message}</p>}
//         </div>
//       )}
      
//       {/* AnimatedHierarchicalSelect component for student information */}
//       <div className="relative" style={{ 
//         zIndex: 40,
//         position: "relative",
//         isolation: "isolate" 
//       }}>
//         <AnimatedHierarchicalSelect 
//           steps={studentSteps} 
//           onComplete={handleComplete}
//           timing={timing}
//           className="w-full"
//           isLastStep={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Student; 