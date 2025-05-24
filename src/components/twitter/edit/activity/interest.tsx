import { MultiSelect, Option } from "@/components/atom/multi-select";

interface InterestsProps {
  value: string[];
  onChange: (interests: string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const INTERESTS = [
  "السياسة",
  "الاقتصاد",
  "التعليم",
  "الصحة",
  "البيئة",
  "التكنولوجيا",
  "الفنون",
  "الرياضة",
  "العمل التطوعي",
  "حقوق الإنسان",
  "التنمية المستدامة",
  "الثقافة",
  "الإعلام",
  "العلوم",
  "الأدب",
] as const;

const INTEREST_OPTIONS: Option[] = INTERESTS.map((interest) => ({
  label: interest,
  value: interest,
}));

export function Interests({ value, onChange, onFocus, onBlur }: InterestsProps) {
  const selectedOptions = value.map(interest => ({
    label: interest,
    value: interest,
  }));

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        الاهتمامات
      </label>
      <MultiSelect
        options={INTEREST_OPTIONS}
        selected={selectedOptions}
        onChange={(selected) => onChange(selected.map(s => s.value))}
        placeholder=" واحدة أو اكثر"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
} 