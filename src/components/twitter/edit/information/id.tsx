import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface IDProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  watch: (field: keyof InformationSchema) => string | undefined;
}

const ID = ({ register, errors, setValue, watch }: IDProps) => {
  // Get current values using watch
  const maritalStatus = watch("maritalStatus");
  const gender = watch("gender");
  const religion = watch("religion");

  return (
    <div className="flex items-center justify-between mt-3 md:mt-0 gap-1 md:gap-4">
      <div className="w-1/4">
        <Select
          onValueChange={(value) => setValue('maritalStatus', value)}
          value={maritalStatus || ""}
          dir="rtl"
        >
          <SelectTrigger className="h-8  flex justify-start text-right [&>svg]:hidden" aria-label="الحالة">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="أعزب">أعزب</SelectItem>
            <SelectItem value="متزوج">متزوج</SelectItem>
            <SelectItem value="مطلق">مطلق</SelectItem>
            <SelectItem value="أرمل">أرمل</SelectItem>
          </SelectContent>
        </Select>
        {errors.maritalStatus && (
          <span className="text-red-500 text-sm">{errors.maritalStatus.message}</span>
        )}
      </div>
      
      <div className="w-1/4">
        <Select
          onValueChange={(value) => setValue('gender', value)}
          value={gender || ""}
          dir="rtl"
        >
          <SelectTrigger className="h-8 flex justify-start text-right [&>svg]:hidden" aria-label="الجنس">
            <SelectValue placeholder="الجنس" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="ذكر">ذكر</SelectItem>
            <SelectItem value="أنثى">أنثى</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <span className="text-red-500 text-sm">{errors.gender.message}</span>
        )}
      </div>
      
      <div className="w-1/4 md:p-2">
        <Select
          onValueChange={(value) => setValue('religion', value)}
          value={religion || ""}
          dir="rtl"
        >
          <SelectTrigger className="h-8 flex justify-start text-right [&>svg]:hidden" aria-label="الديانة">
            <SelectValue placeholder="الديانة" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="الإسلام">الإسلام</SelectItem>
            <SelectItem value="المسيحية">المسيحية</SelectItem>
            <SelectItem value="أخرى">أخرى</SelectItem>
          </SelectContent>
        </Select>
        {errors.religion && (
          <span className="text-red-500 text-sm">{errors.religion.message}</span>
        )}
      </div>
      
      <div className="w-1/4">
        <Input
          id="nationalityId"
          placeholder="رقم وطني"
          className="h-8 text-right"
          dir="rtl"
          {...register('nationalityId')}
        />
        {errors.nationalityId && (
          <span className="text-red-500 text-sm">{errors.nationalityId.message}</span>
        )}
      </div>
    </div>
  );
};

export default ID; 