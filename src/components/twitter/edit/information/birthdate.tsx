'use client';
import { useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InformationSchema } from "./validation";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { useFormValidation } from "./use-validation";
import { useSelect } from "./use-select";
import { 
  COUNTRIES, 
  STATES, 
  LOCALITIES, 
  BIRTH_MONTHS,
  generateBirthYears
} from './constant';

interface BirthdateProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  watch?: UseFormWatch<InformationSchema>;
  defaultValues?: Partial<InformationSchema>;
}

const Birthdate = ({
  register,
  errors,
  setValue,
  watch,
  defaultValues,
}: BirthdateProps) => {
  // Use our custom validation hook
  const { sectionRef } = useFormValidation<InformationSchema>({
    errors,
    errorFields: ['birthCountry', 'birthState', 'birthLocality', 'birthYear', 'birthMonth'],
    errorMessage: "يرجى إكمال بيانات تاريخ الميلاد",
    defaultValues,
    currentValues: watch ? {
      birthCountry: watch('birthCountry'),
      birthState: watch('birthState'),
      birthLocality: watch('birthLocality'),
      birthYear: watch('birthYear'),
      birthMonth: watch('birthMonth')
    } : undefined,
    toastStyle: {
      background: 'rgb(239 68 68)',
      color: 'white',
      border: 'none'
    }
  });
  
  // Use our custom selection handler hook
  const { handleComplete } = useSelect<InformationSchema>({
    setValue,
    fieldMappings: {
      country: 'birthCountry',
      state: 'birthState',
      locality: 'birthLocality',
      year: 'birthYear',
      month: 'birthMonth'
    }
  });

  // Define birthdate steps with better identification for tracking
  const birthdateSteps: SelectionStep[] = [
    {
      id: "country",
      title: "الميلاد",
      placeholder: "اختر دولة الميلاد",
      emptyMessage: "لا توجد دول متاحة",
      getOptions: () => COUNTRIES
    },
    {
      id: "state",
      title: "ولاية الميلاد",
      placeholder: "اختر ولاية الميلاد",
      emptyMessage: "لا توجد ولايات متاحة",
      getOptions: (prev) => {
        const countryId = prev.country?.value;
        return countryId ? (STATES[countryId] || []) : [];
      }
    },
    {
      id: "locality",
      title: "محلية الميلاد",
      placeholder: "اختر محلية الميلاد",
      emptyMessage: "لا توجد محليات متاحة",
      getOptions: (prev) => {
        const stateId = prev.state?.value;
        return stateId ? (LOCALITIES[stateId] || []) : [];
      }
    },
    {
      id: "year",
      title: "سنة الميلاد",
      placeholder: "اختر سنة الميلاد",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => generateBirthYears()
    },
    {
      id: "month",
      title: "شهر الميلاد",
      placeholder: "اختر شهر الميلاد",
      emptyMessage: "لا توجد شهور متاحة",
      getOptions: () => BIRTH_MONTHS
    }
  ];

  // Register all fields required by React Hook Form
  useEffect(() => {
    const hasExistingData = 
      (defaultValues?.birthCountry && defaultValues.birthCountry.length > 0) ||
      (defaultValues?.birthState && defaultValues.birthState.length > 0) ||
      (defaultValues?.birthLocality && defaultValues.birthLocality.length > 0) ||
      // Check for year and month which could be numbers or strings
      (defaultValues?.birthYear != null && defaultValues?.birthYear !== '') ||
      (defaultValues?.birthMonth != null && defaultValues?.birthMonth !== '');
    
    if (!hasExistingData) {
      // Only make fields required if there's no existing data
      register('birthCountry', { required: "يرجى اختيار دولة الميلاد" });
      register('birthState', { required: "يرجى اختيار ولاية الميلاد" });
      register('birthLocality', { required: "يرجى اختيار محلية الميلاد" });
      register('birthYear', { required: "يرجى اختيار سنة الميلاد" });
      register('birthMonth', { required: "يرجى اختيار شهر الميلاد" });
    } else {
      // Register fields as optional if there's existing data
      register('birthCountry');
      register('birthState');
      register('birthLocality');
      register('birthYear');
      register('birthMonth');
    }
  }, [register, defaultValues]);

  // Returning a React component - marking all elements with data-birthdate-field
  return (
    <div className="w-full" ref={sectionRef} data-birthdate-field="true">
      {/* AnimatedHierarchicalSelect component for birthdate selection */}
      <div className="relative" style={{ 
        zIndex: 40,
        position: "relative"
      }} data-birthdate-field="true">
        <AnimatedHierarchicalSelect 
          steps={birthdateSteps}
          onComplete={handleComplete}
          timing={{
            transitionDelay: 250,
            dropdownDelay: 600
          }}
          className="w-full"
          data-birthdate-field="true"
        />
      </div>
    </div>
  );
};

export default Birthdate; 