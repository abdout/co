// import { Input } from "@/components/ui/input";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import SelectPopover, { Item } from "./select-popover";

// interface PersonalInformationProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// const PersonalInformation = ({
//   register,
//   errors,
//   setValue
// }: PersonalInformationProps) => {
//   // Options for personal information dropdowns
//   const maritalStatusOptions: Item[] = [
//     { label: 'أعزب', value: 'SINGLE' },
//     { label: 'متزوج', value: 'MARRIED' },
//     { label: 'مطلق', value: 'DIVORCED' },
//     { label: 'أرمل', value: 'WIDOWED' },
//   ];

//   const genderOptions: Item[] = [
//     { label: 'ذكر', value: 'MALE' },
//     { label: 'أنثى', value: 'FEMALE' },
//   ];

//   const religionOptions: Item[] = [
//     { label: 'مسلم', value: 'MUSLIM' },
//     { label: 'مسيحي', value: 'CHRISTIAN' },
//     { label: 'أخرى', value: 'OTHER' },
//   ];

//   // Handle select for dropdown fields
//   const handleSelectChange = (field: keyof InformationSchema, item: Item | null) => {
//     if (item) {
//       setValue(field, item.label);
//     } else {
//       setValue(field, '');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Name */}
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//           الاسم
//         </label>
//         <Input
//           id="name"
//           {...register('name')}
//           placeholder="الاسم"
//           className="w-full"
//           dir="rtl"
//         />
//         {errors.name && (
//           <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//         )}
//       </div>

//       {/* Full Name */}
//       <div>
//         <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
//           الاسم الكامل
//         </label>
//         <Input
//           id="fullname"
//           {...register('fullname')}
//           placeholder="الاسم الكامل"
//           className="w-full"
//           dir="rtl"
//         />
//         {errors.fullname && (
//           <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
//         )}
//       </div>

//       {/* Marital Status */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           الحالة الاجتماعية
//         </label>
//         <SelectPopover
//           items={maritalStatusOptions}
//           selectedItem={null} // This would be set based on form state
//           setSelectedItem={(item) => handleSelectChange('maritalStatus', item)}
//           label="الحالة الاجتماعية"
//         />
//         {errors.maritalStatus && (
//           <p className="mt-1 text-sm text-red-600">{errors.maritalStatus.message}</p>
//         )}
//       </div>

//       {/* Gender */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           الجنس
//         </label>
//         <SelectPopover
//           items={genderOptions}
//           selectedItem={null} // This would be set based on form state
//           setSelectedItem={(item) => handleSelectChange('gender', item)}
//           label="الجنس"
//         />
//         {errors.gender && (
//           <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//         )}
//       </div>

//       {/* Religion */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           الديانة
//         </label>
//         <SelectPopover
//           items={religionOptions}
//           selectedItem={null} // This would be set based on form state
//           setSelectedItem={(item) => handleSelectChange('religion', item)}
//           label="الديانة"
//         />
//         {errors.religion && (
//           <p className="mt-1 text-sm text-red-600">{errors.religion.message}</p>
//         )}
//       </div>

//       {/* Nationality ID */}
//       <div>
//         <label htmlFor="nationalityId" className="block text-sm font-medium text-gray-700 mb-1">
//           الرقم الوطني
//         </label>
//         <Input
//           id="nationalityId"
//           {...register('nationalityId')}
//           placeholder="الرقم الوطني"
//           className="w-full"
//           dir="rtl"
//         />
//         {errors.nationalityId && (
//           <p className="mt-1 text-sm text-red-600">{errors.nationalityId.message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PersonalInformation; 