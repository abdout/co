// import { MultiSelect, Option } from "@/components/atom/multi-select";

// interface SkillsProps {
//   value: string[];
//   onChange: (skills: string[]) => void;
// }

// const SKILLS = [
//   "القيادة",
//   "التواصل",
//   "العمل الجماعي",
//   "حل المشكلات",
//   "التخطيط",
//   "التنظيم",
//   "إدارة الوقت",
//   "التفاوض",
//   "الإقناع",
//   "التحليل",
//   "البحث",
//   "الكتابة",
//   "العرض",
//   "التدريب",
//   "التوجيه",
// ] as const;

// const SKILL_OPTIONS: Option[] = SKILLS.map((skill) => ({
//   label: skill,
//   value: skill,
// }));

// export function Skills({ value, onChange }: SkillsProps) {
//   const selectedOptions = value.map(skill => ({
//     label: skill,
//     value: skill,
//   }));

//   return (
//     <div className="w-full space-y-2">
//       <label className="block text-sm font-medium text-gray-700">
//         المهارات
//       </label>
//       <MultiSelect
//         options={SKILL_OPTIONS}
//         selected={selectedOptions}
//         onChange={(selected) => onChange(selected.map(s => s.value))}
//         placeholder=" واحدة أو اكثر"
//       />
//     </div>
//   );
// } 