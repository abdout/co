import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import Student from "./student";
import Diploma from "./diploma";
import Bachelor from "./bachelor";
import Master from "./master";
import PhD from "./phd";
import Professor from "./professor";

interface EducationSelectorProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  watch: UseFormWatch<InformationSchema>;
}

const EducationSelector = ({
  register,
  errors,
  setValue,
  watch
}: EducationSelectorProps) => {
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<Item | null>(null);

  // Watch the education level field
  const educationLevel = watch('educationLevel');

  // Education level options
  const educationLevels: Item[] = [
    { label: 'طالب', value: 'student' },
    { label: 'دبلوم', value: 'diploma' },
    { label: 'بكالوريوس', value: 'bachelor' },
    { label: 'ماجستير', value: 'master' },
    { label: 'دكتوراه', value: 'phd' },
    { label: 'بروفيسور', value: 'professor' },
  ];

  // Handle education level selection
  const handleEducationLevelSelect = (item: Item | null) => {
    if (item) {
      setValue('educationLevel', item.label);
      setSelectedEducationLevel(item);
      
      // Reset other fields based on selection
      if (item.value === 'student') {
        // Clear all completion year fields except student fields
        setValue('yearOfCompletion', '');
        setValue('bachelorCompletionYear', '');
        setValue('masterCompletionYear', '');
        setValue('phdCompletionYear', '');
      } else if (item.value === 'diploma') {
        // Clear student fields and advanced degree fields
        setValue('studentYear', '');
        setValue('studentInstitution', '');
        setValue('studentFaculty', '');
        setValue('bachelorCompletionYear', '');
        setValue('masterCompletionYear', '');
        setValue('phdCompletionYear', '');
      } else if (item.value === 'bachelor') {
        // Clear student fields, diploma fields, and advanced degree fields
        setValue('studentYear', '');
        setValue('studentInstitution', '');
        setValue('studentFaculty', '');
        setValue('yearOfCompletion', '');
        setValue('masterCompletionYear', '');
        setValue('phdCompletionYear', '');
      } else if (item.value === 'master') {
        // Clear student fields, diploma fields, and PhD fields
        setValue('studentYear', '');
        setValue('studentInstitution', '');
        setValue('studentFaculty', '');
        setValue('yearOfCompletion', '');
        setValue('phdCompletionYear', '');
      } else if (item.value === 'phd' || item.value === 'professor') {
        // Clear student fields and diploma fields
        setValue('studentYear', '');
        setValue('studentInstitution', '');
        setValue('studentFaculty', '');
        setValue('yearOfCompletion', '');
      }
    } else {
      setValue('educationLevel', '');
      setSelectedEducationLevel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Education Level Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المستوى التعليمي
        </label>
        <input type="hidden" {...register('educationLevel')} value={selectedEducationLevel?.label || ''} />
        <SelectPopover
          items={educationLevels}
          selectedItem={selectedEducationLevel}
          setSelectedItem={handleEducationLevelSelect}
          label="المستوى التعليمي"
        />
        {errors.educationLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.educationLevel.message}</p>
        )}
      </div>

      {/* Render education fields based on selected level */}
      {educationLevel && (
        <div className="mt-4">
          {educationLevel === 'طالب' && (
            <Student
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}

          {educationLevel === 'دبلوم' && (
            <Diploma
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}

          {educationLevel === 'بكالوريوس' && (
            <Bachelor
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}

          {educationLevel === 'ماجستير' && (
            <Master
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}

          {educationLevel === 'دكتوراه' && (
            <PhD
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}

          {educationLevel === 'بروفيسور' && (
            <Professor
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EducationSelector; 