// import React from 'react';
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// interface StudentInfoProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
//   educationLevel: string;
//   studentYearItems: { value: string; label: string }[];
//   onStudentYearSelect: (item: { value: string; label: string }) => void;
//   selectedStudentYear: { value: string; label: string } | null;
// }

// const StudentInfo = ({
//   register,
//   errors,
//   educationLevel,
//   studentYearItems,
//   onStudentYearSelect,
//   selectedStudentYear,
// }: StudentInfoProps) => {
//   if (educationLevel !== 'student') {
//     return null;
//   }

//   return (
//     <div className="w-full" dir="rtl">
//       <div className="flex flex-col mt-4">
//         <div className="mb-4">
//           <p className="text-sm font-semibold mb-2">السنة الدراسية:</p>
//           <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
          
//           <Select
//             onValueChange={(value) => {
//               const selectedItem = studentYearItems.find(item => item.value === value);
//               if (selectedItem) {
//                 onStudentYearSelect(selectedItem);
//               }
//             }}
//             value={selectedStudentYear?.value || ''}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="اختر السنة الدراسية" />
//             </SelectTrigger>
//             <SelectContent>
//               {studentYearItems.map(item => (
//                 <SelectItem key={item.value} value={item.value}>
//                   {item.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
          
//           {/* Hidden field for form validation */}
//           <input 
//             type="hidden" 
//             {...register('studentYear')}
//             value={selectedStudentYear?.value || ''}
//           />
          
//           {errors.studentYear && (
//             <p className="text-xs text-red-500 mt-1">{errors.studentYear.message}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <p className="text-sm font-semibold mb-2">اسم المدرسة / الجامعة:</p>
//           <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
//           <Input
//             className="w-full"
//             placeholder="اسم المدرسة / الجامعة"
//             {...register('institution')}
//           />
//           {errors.institution && (
//             <p className="text-xs text-red-500 mt-1">{errors.institution.message}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <p className="text-sm font-semibold mb-2">التخصص:</p>
//           <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
//           <Input
//             className="w-full"
//             placeholder="التخصص"
//             {...register('major')}
//           />
//           {errors.major && (
//             <p className="text-xs text-red-500 mt-1">{errors.major.message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentInfo; 