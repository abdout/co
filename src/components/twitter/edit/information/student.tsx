'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, faculties, studentYears } from "./constant";
import { useFocusField } from "../useFocusField";


interface StudentProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
}));

const FACULTIES: Option[] = faculties.map(item => ({
  value: item.value,
  label: item.label
}));

const STUDENT_YEARS: Option[] = studentYears.map(item => ({
  value: item.value,
  label: item.label
}));

const Student = ({
  register,
  errors,
  setValue
}: StudentProps) => {
  const [selectedStudentInstitution, setSelectedStudentInstitution] = useState<Item | null>(null);
  const [selectedStudentFaculty, setSelectedStudentFaculty] = useState<Item | null>(null);
  const [selectedStudentYear, setSelectedStudentYear] = useState<Item | null>(null);
  
  // Use the focus field hook for the three fields
  const { getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusField<'institution' | 'faculty' | 'year'>();

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('studentInstitution', { required: "يرجى اختيار الجامعة" });
    register('studentFaculty', { required: "يرجى اختيار التخصص" });
    register('studentYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // Handle student institution selection
  const handleStudentInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('studentInstitution', item.label);
      setSelectedStudentInstitution(item);
    } else {
      setValue('studentInstitution', '');
      setSelectedStudentInstitution(null);
    }
  };

  // Handle student faculty selection
  const handleStudentFacultySelect = (item: Item | null) => {
    if (item) {
      setValue('studentFaculty', item.label);
      setSelectedStudentFaculty(item);
    } else {
      setValue('studentFaculty', '');
      setSelectedStudentFaculty(null);
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

  // Define the hierarchical steps for student selection
  const studentSteps: SelectionStep[] = [
    {
      id: "institution",
      title: "الجامعة",
      placeholder: "اختر الجامعة",
      emptyMessage: "لا توجد جامعات متاحة",
      getOptions: () => INSTITUTIONS
    },
    {
      id: "faculty",
      title: "التخصص",
      placeholder: "اختر التخصص",
      emptyMessage: "لا توجد تخصصات متاحة",
      getOptions: () => FACULTIES
    },
    {
      id: "year",
      title: "السنة",
      placeholder: "اختر السنة",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => STUDENT_YEARS
    }
  ];

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values
    setValue('studentInstitution', selections.institution.label);
    setValue('studentFaculty', selections.faculty.label);
    setValue('studentYear', selections.year.value);

    // Dispatch event when all Student fields are completed
    const event = new CustomEvent('educationFieldCompleted', {
      detail: {
        componentType: 'student',
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
      <p className="text-sm font-semibold mb-2">بيانات الدراسة:</p>
      
      {/* Show error messages */}
      {(errors.studentInstitution || errors.studentFaculty || errors.studentYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.studentInstitution && <p>{errors.studentInstitution.message}</p>}
          {errors.studentFaculty && <p>{errors.studentFaculty.message}</p>}
          {errors.studentYear && <p>{errors.studentYear.message}</p>}
        </div>
      )}

      {/* Debug info */}
      {/* <div className="text-xs text-gray-400">Focused: {focusedField || 'none'}</div> */}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Student Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('studentInstitution')} value={selectedStudentInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedStudentInstitution}
              setSelectedItem={handleStudentInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.studentInstitution && (
              <span className="text-red-500 text-sm">{errors.studentInstitution.message}</span>
            )}
          </div>

          {/* Student Faculty */}
          <div className={getFieldStyle('faculty', 3)}>
            <input type="hidden" {...register('studentFaculty')} value={selectedStudentFaculty?.label || ''} />
            <SelectPopover
              items={faculties}
              selectedItem={selectedStudentFaculty}
              setSelectedItem={handleStudentFacultySelect}
              label="التخصص"
              onFocus={() => setFocusedField('faculty')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.studentFaculty && (
              <span className="text-red-500 text-sm">{errors.studentFaculty.message}</span>
            )}
          </div>

          {/* Student Year */}
          <div className={getFieldStyle('year', 3)}>
            <input type="hidden" {...register('studentYear')} value={selectedStudentYear?.value || ''} />
            <SelectPopover
              items={studentYears}
              selectedItem={selectedStudentYear}
              setSelectedItem={handleStudentYearSelect}
              label="السنة"
              displayValue={selectedStudentYear?.label}
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.studentYear && (
              <span className="text-red-500 text-sm">{errors.studentYear.message}</span>
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
          steps={studentSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Student; 