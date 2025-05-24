'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, diplomaMajors, generateCompletionYears } from "./constant";
import { useFocusField } from "../useFocusField";


interface DiplomaProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  onComplete?: () => void;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const DIPLOMA_MAJORS: Option[] = diplomaMajors.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map((year: { value: string, label: string }) => ({
  value: year.value,
  label: year.label
} as Option));

const Diploma = ({
  register,
  errors,
  setValue,
  onComplete
}: DiplomaProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedYearOfCompletion, setSelectedYearOfCompletion] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [
    // diplomaCompleted
    , setDiplomaCompleted] = useState(false);

  // Use the focus field hook for the three fields
  const { getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusField<'institution' | 'major' | 'completionYear'>();

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('diplomaInstitution', { required: "يرجى اختيار الجامعة" });
    register('diplomaMajor', { required: "يرجى اختيار التخصص" });
    register('diplomaCompletionYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaInstitution', item.label);
      setSelectedInstitution(item);
    } else {
      setValue('diplomaInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle year of completion selection
  const handleYearOfCompletionSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaCompletionYear', item.value);
      setSelectedYearOfCompletion(item);
    } else {
      setValue('diplomaCompletionYear', undefined);
      setSelectedYearOfCompletion(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaMajor', item.label);
      setSelectedMajor(item);
    } else {
      setValue('diplomaMajor', '');
      setSelectedMajor(null);
    }
  };

  // Define the hierarchical steps for diploma selection
  const diplomaSteps: SelectionStep[] = [
    {
      id: "institution",
      title: "الجامعة",
      placeholder: "اختر الجامعة",
      emptyMessage: "لا توجد جامعات متاحة",
      getOptions: () => INSTITUTIONS
    },
    {
      id: "major",
      title: "التخصص",
      placeholder: "اختر التخصص",
      emptyMessage: "لا توجد تخصصات متاحة",
      getOptions: () => DIPLOMA_MAJORS
    },
    {
      id: "completionYear",
      title: "سنة التخرج",
      placeholder: "اختر السنة",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => COMPLETION_YEARS
    }
  ];

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values
    setValue('diplomaInstitution', selections.institution?.label || '');
    setValue('diplomaMajor', selections.major?.label || '');
    setValue('diplomaCompletionYear', selections.completionYear?.value || '');
    
    // Set component as completed
    setDiplomaCompleted(true);
    
    // Check if all fields are filled
    if (
      selections.institution?.value &&
      selections.major?.value &&
      selections.completionYear?.value
    ) {
      // Call onComplete callback if provided
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }
    
    // Maintain the original event dispatch for backward compatibility
    const event = new CustomEvent('educationFieldCompleted', {
      detail: {
        componentType: 'diploma',
        fieldType: 'all'
      }
    });
    document.dispatchEvent(event);
  };

  // Custom animation timing configurations
  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الدبلوم:</p>
      
      {/* Show error messages */}
      {(errors.diplomaInstitution || errors.diplomaMajor || errors.diplomaCompletionYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.diplomaInstitution && <p>{errors.diplomaInstitution.message}</p>}
          {errors.diplomaMajor && <p>{errors.diplomaMajor.message}</p>}
          {errors.diplomaCompletionYear && <p>{errors.diplomaCompletionYear.message}</p>}
        </div>
      )}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('diplomaInstitution')} value={selectedInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedInstitution}
              setSelectedItem={handleInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.diplomaInstitution && (
              <span className="text-red-500 text-sm">{errors.diplomaInstitution.message}</span>
            )}
          </div>

          {/* Major */}
          <div className={getFieldStyle('major', 3)}>
            <input type="hidden" {...register('diplomaMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={diplomaMajors}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.diplomaMajor && (
              <span className="text-red-500 text-sm">{errors.diplomaMajor.message}</span>
            )}
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('completionYear', 3)}>
            <input type="hidden" {...register('diplomaCompletionYear')} value={selectedYearOfCompletion?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedYearOfCompletion}
              setSelectedItem={handleYearOfCompletionSelect}
              label="السنة"
              onFocus={() => setFocusedField('completionYear')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.diplomaCompletionYear && (
              <span className="text-red-500 text-sm">{errors.diplomaCompletionYear.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile UI (smaller than md screens) */}
      <div className="md:hidden relative" style={{ 
        zIndex: 40,
        position: "relative",
        isolation: "isolate" 
      }}>
        <AnimatedHierarchicalSelect 
          steps={diplomaSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Diploma; 