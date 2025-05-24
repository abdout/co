'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, masterMajors, generateCompletionYears } from "./constant";
import { useFocusSelect } from "@/components/twitter/edit/use-focus";


interface MasterProps {
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

const MASTER_MAJORS: Option[] = masterMajors.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
} as Option));

const Master = ({
  register,
  errors,
  setValue,
  onComplete
}: MasterProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [selectedCompletionYear, setSelectedCompletionYear] = useState<Item | null>(null);
  const [masterCompleted, setMasterCompleted] = useState(false);

  // Use the focus field hook for the three fields
  const { 
    // focusedField,
     getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusSelect<'institution' | 'major' | 'year'>();

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('masterInstitution', { required: "يرجى اختيار الجامعة" });
    register('masterMajor', { required: "يرجى اختيار التخصص" });
    register('masterCompletionYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // After it's mounted, log a message
  useEffect(() => {
    // Empty
  }, [onComplete]);
  
  // Track field selection state changes for debugging
  useEffect(() => {
    // Trigger check all fields on any field state change
    if (selectedInstitution || selectedMajor || selectedCompletionYear) {
      checkAllFieldsCompleted();
    }
  }, [selectedInstitution, selectedMajor, selectedCompletionYear]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('masterInstitution', item.label);
      setSelectedInstitution(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('masterInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('masterMajor', item.label);
      setSelectedMajor(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('masterMajor', '');
      setSelectedMajor(null);
    }
  };

  // Handle completion year selection
  const handleCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('masterCompletionYear', item.value);
      setSelectedCompletionYear(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('masterCompletionYear', '');
      setSelectedCompletionYear(null);
    }
  };

  // Check if all fields are completed and trigger onComplete callback
  const checkAllFieldsCompleted = () => {
    // Check if all fields are filled
    if (selectedInstitution && selectedMajor && selectedCompletionYear) {
      // Only proceed if not already marked as completed
      if (!masterCompleted) {
        // Mark the component as completed
        setMasterCompleted(true);
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
        
        // Dispatch the event for backward compatibility
        const event = new CustomEvent('educationFieldCompleted', {
          detail: {
            componentType: 'master',
            fieldType: 'all'
          }
        });
        document.dispatchEvent(event);
      }
    }
  };

  // Define the hierarchical steps for master selection
  const masterSteps: SelectionStep[] = [
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
      getOptions: () => MASTER_MAJORS
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
    setValue('masterInstitution', selections.institution?.label || '');
    setValue('masterMajor', selections.major?.label || '');
    setValue('masterCompletionYear', selections.completionYear?.value || '');
    
    // Set component as completed
    setMasterCompleted(true);
    
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
        componentType: 'master',
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
      <p className="text-sm font-semibold mb-2">بيانات الماجستير:</p>
      
      {/* Show error messages */}
      {(errors.masterInstitution || errors.masterMajor || errors.masterCompletionYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.masterInstitution && <p>{errors.masterInstitution.message}</p>}
          {errors.masterMajor && <p>{errors.masterMajor.message}</p>}
          {errors.masterCompletionYear && <p>{errors.masterCompletionYear.message}</p>}
        </div>
      )}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution')}>
            <input type="hidden" {...register('masterInstitution')} value={selectedInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedInstitution}
              setSelectedItem={handleInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.masterInstitution && (
              <span className="text-red-500 text-sm">{errors.masterInstitution.message}</span>
            )}
          </div>

          {/* Major */}
          <div className={getFieldStyle('major')}>
            <input type="hidden" {...register('masterMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={masterMajors}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.masterMajor && (
              <span className="text-red-500 text-sm">{errors.masterMajor.message}</span>
            )}
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year')}>
            <input type="hidden" {...register('masterCompletionYear')} value={selectedCompletionYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedCompletionYear}
              setSelectedItem={handleCompletionYearSelect}
              label="السنة"
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.masterCompletionYear && (
              <span className="text-red-500 text-sm">{errors.masterCompletionYear.message}</span>
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
          steps={masterSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Master; 