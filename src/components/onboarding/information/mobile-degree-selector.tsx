// import { UseFormSetValue } from "react-hook-form";
// import { InformationSchema } from "./validation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useEffect } from "react";

// // Component for selecting the education level
// interface DegreeSelectorProps {
//   setValue: UseFormSetValue<InformationSchema>;
//   educationLevel: string;
//   setEducationLevel: (level: string) => void;
// }

// const DegreeSelector = ({ setValue, educationLevel, setEducationLevel }: DegreeSelectorProps) => {
//   // Set default to student if not already set
//   useEffect(() => {
//     if (!educationLevel) {
//       setValue('educationLevel', 'student');
//       setEducationLevel('student');
//     }
//   }, [educationLevel, setValue, setEducationLevel]);

//   const handleValueChange = (value: string) => {
//     setValue('educationLevel', value);
//     setEducationLevel(value);
//   };

//   return (
//     <div dir="rtl" className="flex flex-col">
//       <p className="text-sm font-semibold mb-2">الدرجة العلمية</p>
      
//       <div className="w-full">
//         <Select
//           onValueChange={handleValueChange}
//           value={educationLevel || "student"}
//           dir="rtl"
//         >
//           <SelectTrigger className="h-9 text-right" aria-label="الدرجة العلمية">
//             <SelectValue placeholder="اختر الدرجة العلمية" />
//           </SelectTrigger>
//           <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
//             <SelectItem value="student">طالب</SelectItem>
//             <SelectItem value="diploma">دبلوم</SelectItem>
//             <SelectItem value="bachelor">بكالوريوس</SelectItem>
//             <SelectItem value="master">ماجستير</SelectItem>
//             <SelectItem value="phd">دكتوراه</SelectItem>
//             <SelectItem value="professor">أستاذية</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// };

// export default DegreeSelector; 