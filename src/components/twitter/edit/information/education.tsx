import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";

interface EducationProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  watch: UseFormWatch<InformationSchema>;
}

const Education = ({
  register,
  errors,
  setValue,
  watch
}: EducationProps) => {
  // Education level state
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<Item | null>(null);
  const [selectedStudentYear, setSelectedStudentYear] = useState<Item | null>(null);
  const [selectedYearOfCompletion, setSelectedYearOfCompletion] = useState<Item | null>(null);
  const [selectedBachelorCompletionYear, setSelectedBachelorCompletionYear] = useState<Item | null>(null);
  const [selectedMasterCompletionYear, setSelectedMasterCompletionYear] = useState<Item | null>(null);
  const [selectedPhdCompletionYear, setSelectedPhdCompletionYear] = useState<Item | null>(null);

  // Watch values
  const educationLevel = watch('educationLevel');

  // Education options
  const educationLevels: Item[] = [
    { label: 'طالب', value: 'STUDENT' },
    { label: 'دبلوم', value: 'DIPLOMA' },
    { label: 'بكالوريوس', value: 'BACHELOR' },
    { label: 'ماجستير', value: 'MASTER' },
    { label: 'دكتوراه', value: 'PHD' },
    { label: 'بروفيسور', value: 'PROFESSOR' },
  ];

  // Student years
  const studentYears: Item[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];

  // Generate years for completion dropdown
  const generateCompletionYears = (): Item[] => {
    const currentYear = new Date().getFullYear();
    const years: Item[] = [];
    // Generate years from 50 years ago to current year
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    return years;
  };

  // Handle education level selection
  const handleEducationLevelSelect = (item: Item | null) => {
    if (item) {
      setValue('educationLevel', item.label);
      setSelectedEducationLevel(item);
      
      // Reset other fields based on selected level
      if (item.value !== 'STUDENT') {
        setSelectedStudentYear(null);
        setValue('studentYear', '');
      }
      
      // Reset completion years when changing education level
      setSelectedYearOfCompletion(null);
      setSelectedBachelorCompletionYear(null);
      setSelectedMasterCompletionYear(null);
      setSelectedPhdCompletionYear(null);
      setValue('yearOfCompletion', '');
      setValue('bachelorCompletionYear', '');
      setValue('masterCompletionYear', '');
      setValue('phdCompletionYear', '');
    } else {
      setValue('educationLevel', '');
      setSelectedEducationLevel(null);
    }
  };

  // Handle student year selection
  const handleStudentYearSelect = (item: Item | null) => {
    if (item) {
      setValue('studentYear', item.value);
      setSelectedStudentYear(item);
    } else {
      setValue('studentYear', '');
      setSelectedStudentYear(null);
    }
  };

  // Handle year of completion selection
  const handleYearOfCompletionSelect = (item: Item | null) => {
    if (item) {
      setValue('yearOfCompletion', item.value);
      setSelectedYearOfCompletion(item);
    } else {
      setValue('yearOfCompletion', '');
      setSelectedYearOfCompletion(null);
    }
  };

  // Handle bachelor completion year selection
  const handleBachelorCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorCompletionYear', item.value);
      setSelectedBachelorCompletionYear(item);
    } else {
      setValue('bachelorCompletionYear', '');
      setSelectedBachelorCompletionYear(null);
    }
  };

  // Handle master completion year selection
  const handleMasterCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('masterCompletionYear', item.value);
      setSelectedMasterCompletionYear(item);
    } else {
      setValue('masterCompletionYear', '');
      setSelectedMasterCompletionYear(null);
    }
  };

  // Handle phd completion year selection
  const handlePhdCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('phdCompletionYear', item.value);
      setSelectedPhdCompletionYear(item);
    } else {
      setValue('phdCompletionYear', '');
      setSelectedPhdCompletionYear(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Education Level */}
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

      {/* Student Year - Show only if education level is Student */}
      {educationLevel === 'طالب' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السنة الدراسية
          </label>
          <input type="hidden" {...register('studentYear')} value={selectedStudentYear?.value || ''} />
          <SelectPopover
            items={studentYears}
            selectedItem={selectedStudentYear}
            setSelectedItem={handleStudentYearSelect}
            label="السنة الدراسية"
          />
          {errors.studentYear && (
            <p className="mt-1 text-sm text-red-600">{errors.studentYear.message}</p>
          )}
        </div>
      )}

      {/* Diploma Completion Year */}
      {educationLevel === 'دبلوم' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سنة التخرج
          </label>
          <input type="hidden" {...register('yearOfCompletion')} value={selectedYearOfCompletion?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedYearOfCompletion}
            setSelectedItem={handleYearOfCompletionSelect}
            label="سنة التخرج"
          />
          {errors.yearOfCompletion && (
            <p className="mt-1 text-sm text-red-600">{errors.yearOfCompletion.message}</p>
          )}
        </div>
      )}

      {/* Bachelor Level */}
      {(educationLevel === 'بكالوريوس' || educationLevel === 'ماجستير' || 
        educationLevel === 'دكتوراه' || educationLevel === 'بروفيسور') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سنة تخرج البكالوريوس
          </label>
          <input type="hidden" {...register('bachelorCompletionYear')} value={selectedBachelorCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedBachelorCompletionYear}
            setSelectedItem={handleBachelorCompletionYearSelect}
            label="سنة تخرج البكالوريوس"
          />
          {errors.bachelorCompletionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.bachelorCompletionYear.message}</p>
          )}
        </div>
      )}

      {/* Master Level */}
      {(educationLevel === 'ماجستير' || educationLevel === 'دكتوراه' || 
        educationLevel === 'بروفيسور') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سنة تخرج الماجستير
          </label>
          <input type="hidden" {...register('masterCompletionYear')} value={selectedMasterCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedMasterCompletionYear}
            setSelectedItem={handleMasterCompletionYearSelect}
            label="سنة تخرج الماجستير"
          />
          {errors.masterCompletionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.masterCompletionYear.message}</p>
          )}
        </div>
      )}

      {/* PhD Level */}
      {(educationLevel === 'دكتوراه' || educationLevel === 'بروفيسور') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سنة تخرج الدكتوراه
          </label>
          <input type="hidden" {...register('phdCompletionYear')} value={selectedPhdCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedPhdCompletionYear}
            setSelectedItem={handlePhdCompletionYearSelect}
            label="سنة تخرج الدكتوراه"
          />
          {errors.phdCompletionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.phdCompletionYear.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Education; 