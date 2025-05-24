// import { useState } from "react";
// import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import SelectPopover, { Item } from "./select-popover";

// interface BirthInformationProps {
//   register: UseFormRegister<InformationSchema>;
//   errors: FieldErrors<InformationSchema>;
//   setValue: UseFormSetValue<InformationSchema>;
// }

// const BirthInformation = ({
//   register,
//   errors,
//   setValue
// }: BirthInformationProps) => {
//   // Birth location state
//   const [selectedBirthCountry, setSelectedBirthCountry] = useState<Item | null>(null);
//   const [selectedBirthState, setSelectedBirthState] = useState<Item | null>(null);
//   const [selectedBirthLocality, setSelectedBirthLocality] = useState<Item | null>(null);

//   // Years for birth year dropdown
//   const generateYears = (): Item[] => {
//     const currentYear = new Date().getFullYear();
//     const years: Item[] = [];
//     // Generate years from current year down to 80 years ago (for age range)
//     for (let year = currentYear; year >= currentYear - 80; year--) {
//       years.push({ label: year.toString(), value: year.toString() });
//     }
//     return years;
//   };

//   // Sample data for birth location fields
//   const countries: Item[] = [
//     { label: 'السودان', value: 'SD' },
//     { label: 'مصر', value: 'EG' },
//     { label: 'السعودية', value: 'SA' },
//     { label: 'الامارات', value: 'AE' },
//   ];

//   const states: Record<string, Item[]> = {
//     SD: [
//       { label: 'الخرطوم', value: 'KH' },
//       { label: 'الجزيرة', value: 'GZ' },
//       { label: 'نهر النيل', value: 'NR' },
//     ],
//     EG: [
//       { label: 'القاهرة', value: 'CA' },
//       { label: 'الإسكندرية', value: 'AL' },
//     ],
//   };

//   const localities: Record<string, Item[]> = {
//     KH: [
//       { label: 'أم درمان', value: 'OMD' },
//       { label: 'بحري', value: 'BH' },
//     ],
//     CA: [
//       { label: 'مدينة نصر', value: 'NS' },
//     ],
//   };

//   // Handle birth year selection
//   const handleBirthYearSelect = (item: Item | null) => {
//     if (item) {
//       setValue('birthYear', item.value);
//     } else {
//       setValue('birthYear', '');
//     }
//   };

//   // Handle birth location selection
//   const handleBirthLocationSelect = (fieldName: keyof InformationSchema, item: Item | null) => {
//     if (item) {
//       setValue(fieldName, item.label);
      
//       // Reset child selections when parent changes
//       if (fieldName === 'birthCountry') {
//         setSelectedBirthCountry(item);
//         setSelectedBirthState(null);
//         setSelectedBirthLocality(null);
//         setValue('birthState', '');
//         setValue('birthLocality', '');
//       } else if (fieldName === 'birthState') {
//         setSelectedBirthState(item);
//         setSelectedBirthLocality(null);
//         setValue('birthLocality', '');
//       } else if (fieldName === 'birthLocality') {
//         setSelectedBirthLocality(item);
//       }
//     } else {
//       setValue(fieldName, '');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Birth Year */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           سنة الميلاد
//         </label>
//         <input type="hidden" {...register('birthYear')} />
//         <SelectPopover
//           items={generateYears()}
//           selectedItem={null} // This would be set based on the form state
//           setSelectedItem={handleBirthYearSelect}
//           label="سنة الميلاد"
//         />
//         {errors.birthYear && (
//           <p className="mt-1 text-sm text-red-600">{errors.birthYear.message}</p>
//         )}
//       </div>

//       {/* Birth Country */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           بلد الميلاد
//         </label>
//         <input type="hidden" {...register('birthCountry')} value={selectedBirthCountry?.label || ''} />
//         <SelectPopover
//           items={countries}
//           selectedItem={selectedBirthCountry}
//           setSelectedItem={(item) => handleBirthLocationSelect('birthCountry', item)}
//           label="بلد الميلاد"
//         />
//         {errors.birthCountry && (
//           <p className="mt-1 text-sm text-red-600">{errors.birthCountry.message}</p>
//         )}
//       </div>

//       {/* Birth State - Show only if country is selected */}
//       {selectedBirthCountry && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             ولاية الميلاد
//           </label>
//           <input type="hidden" {...register('birthState')} value={selectedBirthState?.label || ''} />
//           <SelectPopover
//             items={selectedBirthCountry ? states[selectedBirthCountry.value] || [] : []}
//             selectedItem={selectedBirthState}
//             setSelectedItem={(item) => handleBirthLocationSelect('birthState', item)}
//             label="ولاية الميلاد"
//           />
//           {errors.birthState && (
//             <p className="mt-1 text-sm text-red-600">{errors.birthState.message}</p>
//           )}
//         </div>
//       )}

//       {/* Birth Locality - Show only if state is selected */}
//       {selectedBirthState && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             محلية الميلاد
//           </label>
//           <input type="hidden" {...register('birthLocality')} value={selectedBirthLocality?.label || ''} />
//           <SelectPopover
//             items={selectedBirthState ? localities[selectedBirthState.value] || [] : []}
//             selectedItem={selectedBirthLocality}
//             setSelectedItem={(item) => handleBirthLocationSelect('birthLocality', item)}
//             label="محلية الميلاد"
//           />
//           {errors.birthLocality && (
//             <p className="mt-1 text-sm text-red-600">{errors.birthLocality.message}</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BirthInformation; 