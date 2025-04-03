import { 
  COUNTRIES, STATES, LOCALITIES, NEIGHBORHOODS,
  BIRTH_MONTHS,
  studentYears, faculties, diplomaMajors, bachelorMajors, 
  masterMajors, phdMajors, professorMajors
} from '../components/onboarding/information/constant';

/**
 * Simple utility to find Arab label for a value from a list of options
 */
export function findLabel(options: Array<{value: string, label: string}>, value?: string): string {
  if (!value) return '';
  const option = options.find(opt => opt.value === value);
  return option?.label || value;
}

// Simplified lookup functions for common types
export const getCountryLabel = (value?: string) => findLabel(COUNTRIES, value);
export const getStateLabel = (value?: string, countryValue?: string) => {
  if (!value || !countryValue) return value || '';
  return findLabel(STATES[countryValue] || [], value);
};
export const getLocalityLabel = (value?: string) => {
  if (!value) return '';
  
  // Search through all locality arrays
  for (const stateKey in LOCALITIES) {
    const option = LOCALITIES[stateKey].find(opt => opt.value === value);
    if (option) return option.label;
  }
  
  return value;
};
export const getNeighborhoodLabel = (value?: string) => {
  if (!value) return '';
  
  // Search through all neighborhood arrays
  for (const adminKey in NEIGHBORHOODS) {
    const option = NEIGHBORHOODS[adminKey]?.find(opt => opt.value === value);
    if (option) return option.label;
  }
  
  return value;
};

// Education levels
export const getMonthLabel = (month?: string) => findLabel(BIRTH_MONTHS, month);
export const getStudentYearLabel = (year?: string) => findLabel(studentYears, year);
export const getFacultyLabel = (faculty?: string) => findLabel(faculties, faculty);
export const getMajorLabel = (major?: string, level?: string) => {
  if (!major) return '';
  
  if (level === 'diploma') return findLabel(diplomaMajors, major);
  if (level === 'bachelor') return findLabel(bachelorMajors, major);
  if (level === 'master') return findLabel(masterMajors, major);
  if (level === 'phd') return findLabel(phdMajors, major);
  if (level === 'professor') return findLabel(professorMajors, major);
  
  // If no specific level, search all major arrays
  const allMajors = [
    ...diplomaMajors,
    ...bachelorMajors,
    ...masterMajors,
    ...phdMajors,
    ...professorMajors
  ];
  
  return findLabel(allMajors, major);
}; 