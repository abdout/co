// 'use client';
// import React, { useState } from "react";
// import { User } from "@prisma/client";
// import { useRouter } from "next/navigation";
// import { updateProfile } from "@/components/onboarding/actions";
// import { Tabs, TabsContent } from "@/components/ui/tabs";
// import SelectPopover from "@/components/atom/popover/popover";

// interface Item {
//   label: string;
//   value: string;
// }

// type FieldName = 'Country' | 'Locality' | 'Year' | 'Month';
// type FormDataType = {
//   [key in FieldName]: Item | null;
// };

// const Birthdate = ({ user }: { user: User }) => {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
  
//   const [formData, setFormData] = useState<FormDataType>({
//     Country: user?.birthCountry
//       ? { label: user.birthCountry, value: user.birthCountry }
//       : null,
//     Locality: user?.birthLocality
//       ? { label: user.birthLocality, value: user.birthLocality }
//       : null,
//     Year: user?.birthYear
//       ? { label: user.birthYear.toString(), value: user.birthYear.toString() }
//       : null,
//     Month: user?.birthMonth
//       ? { label: user.birthMonth.toString(), value: user.birthMonth.toString() }
//       : null,
//   });

//   // Data options
//   const countries: Item[] = [
//     { label: 'السودان', value: 'SD' },
//     { label: 'مصر', value: 'EG' },
//     { label: 'السعودية', value: 'SA' },
//     { label: 'الامارات', value: 'AE' },
//   ];

//   const localities: { [key: string]: Item[] } = {
//     'SD': [
//       { label: 'الخرطوم', value: 'KRT' },
//       { label: 'امدرمان', value: 'OMD' },
//       { label: 'بحري', value: 'BAH' },
//     ],
//   };

//   const years: Item[] = Array.from({ length: 100 }, (_, i) => {
//     const year = new Date().getFullYear() - i;
//     return { label: year.toString(), value: year.toString() };
//   });

//   const months: Item[] = [
//     { label: 'يناير', value: '1' },
//     { label: 'فبراير', value: '2' },
//     { label: 'مارس', value: '3' },
//     { label: 'ابريل', value: '4' },
//     { label: 'مايو', value: '5' },
//     { label: 'يونيو', value: '6' },
//     { label: 'يوليو', value: '7' },
//     { label: 'اغسطس', value: '8' },
//     { label: 'سبتمبر', value: '9' },
//     { label: 'اكتوبر', value: '10' },
//     { label: 'نوفمبر', value: '11' },
//     { label: 'ديسمبر', value: '12' },
//   ];

//   const handleSelect = (name: FieldName, item: Item | null) => {
//     const fields: FieldName[] = ['Country', 'Locality', 'Year', 'Month'];
//     const index = fields.indexOf(name);

//     setFormData((prev) => {
//       const newFormData = {
//         ...prev,
//         [name]: item,
//       };

//       if (item?.value !== prev[name]?.value) {
//         for (let i = index + 1; i < fields.length; i++) {
//           newFormData[fields[i]] = null;
//         }
//       }

//       return newFormData;
//     });

//     setCurrentStep((prev) => Math.max(prev, index + 2));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const submissionData = {
//         birthCountry: formData.Country?.value || '',
//         birthLocality: formData.Locality?.value || '',
//         birthYear: Number(formData.Year?.value) || 0,
//         birthMonth: Number(formData.Month?.value) || 0,
//       };

//       const response = await updateProfile(submissionData);
//       if (response.success) {
//         router.refresh();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const resetStep = () => {
//     setCurrentStep(1);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//       <Tabs defaultValue="birthdate" className="w-full" dir="rtl">
//         <TabsContent value="birthdate">
//           <div className="space-y-4">
//             {currentStep === 1 && (
//               <div>
//                 <SelectPopover
//                   items={countries}
//                   selectedItem={formData.Country}
//                   setSelectedItem={(item) => handleSelect('Country', item)}
//                   label={formData.Country?.label || 'الميلاد'}
//                 />
//               </div>
//             )}
            
//             {currentStep === 2 && formData.Country && (
//               <div>
//                 <SelectPopover
//                   items={localities[formData.Country.value] || []}
//                   selectedItem={formData.Locality}
//                   setSelectedItem={(item) => handleSelect('Locality', item)}
//                   label={formData.Locality?.label || 'المدينة'}
//                 />
//               </div>
//             )}

//             {currentStep === 3 && formData.Locality && (
//               <div>
//                 <SelectPopover
//                   items={years}
//                   selectedItem={formData.Year}
//                   setSelectedItem={(item) => handleSelect('Year', item)}
//                   label={formData.Year?.label || 'السنة'}
//                 />
//               </div>
//             )}

//             {currentStep === 4 && formData.Year && (
//               <div>
//                 <SelectPopover
//                   items={months}
//                   selectedItem={formData.Month}
//                   setSelectedItem={(item) => handleSelect('Month', item)}
//                   label={formData.Month?.label || 'الشهر'}
//                 />
//               </div>
//             )}

//             {currentStep > 4 && (
//               <div>
//                 <p className="text-green-500">تم إدخال تاريخ الميلاد بنجاح!</p>
//                 <button
//                   type="button"
//                   onClick={resetStep}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//                 >
//                   تعديل
//                 </button>
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </form>
//   );
// };

// export default Birthdate;

