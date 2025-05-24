'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, bachelorMajors, generateCompletionYears } from "./constant";
import { useFocusField } from "../useFocusField";


interface BachelorProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  onComplete?: () => void;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
}));

const BACHELOR_MAJORS: Option[] = bachelorMajors.map(item => ({
  value: item.value,
  label: item.label
}));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
}));

const Bachelor = ({
  register,
  errors,
  setValue,
  onComplete
}: BachelorProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedBachelorYear, setSelectedBachelorYear] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [
    // bachelorCompleted
    , setBachelorCompleted] = useState(false);

  // Use the focus field hook for the three fields
  const { getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusField<'institution' | 'major' | 'year'>();

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('bachelorInstitution', { required: "يرجى اختيار الجامعة" });
    register('bachelorMajor', { required: "يرجى اختيار التخصص" });
    register('bachelorCompletionYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorInstitution', item.label);
      setSelectedInstitution(item);
    } else {
      setValue('bachelorInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle bachelor completion year selection
  const handleBachelorYearSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorCompletionYear', item.value);
      setSelectedBachelorYear(item);
    } else {
      setValue('bachelorCompletionYear', undefined);
      setSelectedBachelorYear(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorMajor', item.label);
      setSelectedMajor(item);
    } else {
      setValue('bachelorMajor', '');
      setSelectedMajor(null);
    }
  };

  // Define the hierarchical steps for bachelor selection
  const bachelorSteps: SelectionStep[] = [
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
      getOptions: () => BACHELOR_MAJORS
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
    setValue('bachelorInstitution', selections.institution?.label || '');
    setValue('bachelorMajor', selections.major?.label || '');
    setValue('bachelorCompletionYear', selections.completionYear?.value || '');
    
    // Set component as completed
    setBachelorCompleted(true);
    
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
        componentType: 'bachelor',
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
      <p className="text-sm font-semibold mb-2">بيانات البكالوريوس:</p>
      
      {/* Show error messages */}
      {(errors.bachelorInstitution || errors.bachelorMajor || errors.bachelorCompletionYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.bachelorInstitution && <p>{errors.bachelorInstitution.message}</p>}
          {errors.bachelorMajor && <p>{errors.bachelorMajor.message}</p>}
          {errors.bachelorCompletionYear && <p>{errors.bachelorCompletionYear.message}</p>}
        </div>
      )}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('bachelorInstitution')} value={selectedInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedInstitution}
              setSelectedItem={handleInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.bachelorInstitution && (
              <span className="text-red-500 text-sm">{errors.bachelorInstitution.message}</span>
            )}
          </div>

          {/* Major */}
          <div className={getFieldStyle('major', 3)}>
            <input type="hidden" {...register('bachelorMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={bachelorMajors}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.bachelorMajor && (
              <span className="text-red-500 text-sm">{errors.bachelorMajor.message}</span>
            )}
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year', 3)}>
            <input type="hidden" {...register('bachelorCompletionYear')} value={selectedBachelorYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedBachelorYear}
              setSelectedItem={handleBachelorYearSelect}
              label="السنة"
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.bachelorCompletionYear && (
              <span className="text-red-500 text-sm">{errors.bachelorCompletionYear.message}</span>
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
          steps={bachelorSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Bachelor; 