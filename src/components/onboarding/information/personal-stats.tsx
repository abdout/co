// import React from 'react';
// import { UseFormRegister, FieldErrors } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface PersonalStatsProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   birthYearItems: { value: string; label: string }[];
//   onBirthYearSelect: (item: { value: string; label: string }) => void;
//   selectedBirthYear: { value: string; label: string } | null;
// }

// const PersonalStats = ({
//   register,
//   errors,
//   birthYearItems,
//   onBirthYearSelect,
//   selectedBirthYear,
// }: PersonalStatsProps) => {
//   return (
//     <div className="w-full" dir="rtl">
//       <div className="flex flex-col mt-4">
//         <div className="mb-4">
//           <p className="text-sm font-semibold mb-2">سنة الميلاد:</p>
//           <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
          
//           <Select
//             onValueChange={(value) => {
//               const selectedItem = birthYearItems.find(item => item.value === value);
//               if (selectedItem) {
//                 onBirthYearSelect(selectedItem);
//               }
//             }}
//             value={selectedBirthYear?.value || ''}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="اختر سنة الميلاد" />
//             </SelectTrigger>
//             <SelectContent>
//               {birthYearItems.map(item => (
//                 <SelectItem key={item.value} value={item.value}>
//                   {item.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
          
//           {/* Hidden field for form validation */}
//           <input 
//             type="hidden" 
//             {...register('birthYear')}
//             value={selectedBirthYear?.value || ''}
//           />
          
//           {errors.birthYear && (
//             <p className="text-xs text-red-500 mt-1">{errors.birthYear.message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalStats; 