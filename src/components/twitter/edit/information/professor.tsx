'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, professorMajors, generateCompletionYears } from "./constant";
import { useFocusField } from "../useFocusField";



interface ProfessorProps {
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

const PROFESSOR_MAJORS: Option[] = professorMajors.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
} as Option));

const Professor = ({
  register,
  errors,
  setValue,
  onComplete
}: ProfessorProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [selectedCompletionYear, setSelectedCompletionYear] = useState<Item | null>(null);
  const [professorCompleted, setProfessorCompleted] = useState(false);

  // Use the focus field hook for the three fields
  const { 
    // focusedField,
     getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusField<'institution' | 'major' | 'year'>();

  // Track field selection state changes for debugging
  useEffect(() => {
    // Trigger check all fields on any field state change
    if (selectedInstitution || selectedMajor || selectedCompletionYear) {
      checkAllFieldsCompleted();
    }
  }, [selectedInstitution, selectedMajor, selectedCompletionYear]);

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('professorInstitution', { required: "يرجى اختيار الجامعة" });
    register('professorMajor', { required: "يرجى اختيار التخصص" });
    register('professorCompletionYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('professorInstitution', item.label);
      setSelectedInstitution(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('professorInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('professorMajor', item.label);
      setSelectedMajor(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('professorMajor', '');
      setSelectedMajor(null);
    }
  };

  // Handle completion year selection
  const handleCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('professorCompletionYear', item.value);
      setSelectedCompletionYear(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('professorCompletionYear', '');
      setSelectedCompletionYear(null);
    }
  };

  // Check if all fields are completed and trigger onComplete callback
  const checkAllFieldsCompleted = () => {
    // Check if all fields are filled
    if (selectedInstitution && selectedMajor && selectedCompletionYear) {
      // Only proceed if not already marked as completed
      if (!professorCompleted) {
        // Mark the component as completed
        setProfessorCompleted(true);
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
        
        // Dispatch the event for backward compatibility
        const event = new CustomEvent('educationFieldCompleted', {
          detail: {
            componentType: 'professor',
            fieldType: 'all'
          }
        });
        document.dispatchEvent(event);
      }
    }
  };

  // Define the hierarchical steps for professor selection
  const professorSteps: SelectionStep[] = [
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
      getOptions: () => PROFESSOR_MAJORS
    },
    {
      id: "completionYear",
      title: "سنة التخرج",
      placeholder: "اختر السنة",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => COMPLETION_YEARS
    }
  ];

  // Custom animation timing configurations
  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  // Call onComplete when all professor fields are filled in mobile view
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values (keeping original field names)
    setValue('professorInstitution', selections.institution?.label || '');
    setValue('professorMajor', selections.major?.label || '');
    setValue('professorCompletionYear', selections.completionYear?.value || '');

    setProfessorCompleted(true);
    
    console.log('🔍 DEBUG: Professor fields completed:', {
      institution: selections.institution?.label,
      major: selections.major?.label,
      completionYear: selections.completionYear?.value
    });
    console.log('🔍 DEBUG: onComplete callback exists:', !!onComplete);

    // Check if all fields are filled
    if (
      selections.institution?.value &&
      selections.major?.value &&
      selections.completionYear?.value
    ) {
      // Call onComplete callback if provided
      if (onComplete) {
        console.log('🔍 DEBUG: Calling Professor onComplete callback');
        onComplete();
      }
    } else {
      console.log('🔍 DEBUG: Not all Professor fields filled in:', 
        !selections.institution?.value ? 'Missing institution' : 
        !selections.major?.value ? 'Missing major' : 
        'Missing completion year');
    }
    
    // Maintain the original event dispatch for backward compatibility
    const event = new CustomEvent('educationFieldCompleted', {
      detail: {
        componentType: 'professor',
        fieldType: 'all'
      }
    });
    document.dispatchEvent(event);
  };

  // Force complete for debugging
  // const forceComplete = () => {
  //   setProfessorCompleted(true);
    
  //   if (onComplete) {
  //     onComplete();
  //   }
    
  //   // Dispatch event
  //   const event = new CustomEvent('educationFieldCompleted', {
  //     detail: {
  //       componentType: 'professor',
  //       fieldType: 'all'
  //     }
  //   });
  //   document.dispatchEvent(event);
  // };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الأستاذية:</p>
      
      {/* Show error messages */}
      {(errors.professorInstitution || errors.professorMajor || errors.professorCompletionYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.professorInstitution && <p>{errors.professorInstitution.message}</p>}
          {errors.professorMajor && <p>{errors.professorMajor.message}</p>}
          {errors.professorCompletionYear && <p>{errors.professorCompletionYear.message}</p>}
        </div>
      )}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('professorInstitution')} value={selectedInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedInstitution}
              setSelectedItem={handleInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.professorInstitution && (
              <span className="text-red-500 text-sm">{errors.professorInstitution.message}</span>
            )}
          </div>

          {/* Major */}
          <div className={getFieldStyle('major', 3)}>
            <input type="hidden" {...register('professorMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={professorMajors}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.professorMajor && (
              <span className="text-red-500 text-sm">{errors.professorMajor.message}</span>
            )}
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year', 3)}>
            <input type="hidden" {...register('professorCompletionYear')} value={selectedCompletionYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedCompletionYear}
              setSelectedItem={handleCompletionYearSelect}
              label="السنة"
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.professorCompletionYear && (
              <span className="text-red-500 text-sm">{errors.professorCompletionYear.message}</span>
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
          steps={professorSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Professor; 