import { Item } from "./select-popover";

export const INFORMATION_FIELDS = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'fullname', label: 'Full Name', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'birthMonth', label: 'Birth Month', type: 'number' },
  { name: 'birthYear', label: 'Birth Year', type: 'number' },
  { name: 'birthCountry', label: 'Birth Country', type: 'text' },
  { name: 'birthState', label: 'Birth State', type: 'text' },
  { name: 'birthLocality', label: 'Birth Locality', type: 'text' },
  { name: 'currentLocality', label: 'Current Locality', type: 'text' },
  { name: 'currentCountry', label: 'Current Country', type: 'text' },
  { name: 'currentState', label: 'Current State', type: 'text' },
  { name: 'currentAdminUnit', label: 'Current Admin Unit', type: 'text' },
  { name: 'currentNeighborhood', label: 'Current Neighborhood', type: 'text' },
  { name: 'originalLocality', label: 'Original Locality', type: 'text' },
  { name: 'originalCountry', label: 'Original Country', type: 'text' },
  { name: 'educationLevel', label: 'Education Level', type: 'text' },
  { name: 'institution', label: 'Institution', type: 'text' },
  { name: 'yearOfCompletion', label: 'Year of Completion', type: 'number' },
  { name: 'currentOccupation', label: 'Current Occupation', type: 'text' },
  { name: 'employmentSector', label: 'Employment Sector', type: 'text' },
  { name: 'workplaceAddress', label: 'Workplace Address', type: 'text' },
  { name: 'maritalStatus', label: 'Marital Status', type: 'text' },
  { name: 'gender', label: 'Gender', type: 'text' },
  { name: 'religion', label: 'Religion', type: 'text' },
  { name: 'nationalityId', label: 'Nationality ID', type: 'text' },
];

// Educational institutions
export const institutions: Item[] = [
  { label: 'جامعة الخرطوم', value: 'khartoum_university' },
  { label: 'جامعة القاهرة', value: 'cairo_university' },
  { label: 'جامعة العلوم والتكنولوجيا', value: 'science_tech_university' },
];

// Student years
export const studentYears: Item[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

// Faculties
export const faculties: Item[] = [
  { label: 'كلية الطب', value: 'medicine' },
  { label: 'كلية الهندسة', value: 'engineering' },
  { label: 'كلية العلوم', value: 'science' },
  { label: 'كلية الحقوق', value: 'law' },
];

// Majors by degree level
export const diplomaMajors: Item[] = [
  { label: 'علوم حاسوب', value: 'computer_science' },
  { label: 'هندسة', value: 'engineering' },
];

export const bachelorMajors: Item[] = [
  { label: 'علوم حاسوب', value: 'computer_science' },
  { label: 'هندسة', value: 'engineering' },
];

export const masterMajors: Item[] = [
  { label: 'علوم حاسوب', value: 'computer_science' },
  { label: 'هندسة', value: 'engineering' },
];

export const phdMajors: Item[] = [
  { label: 'علوم حاسوب', value: 'computer_science' },
  { label: 'هندسة', value: 'engineering' },
];

export const professorMajors: Item[] = [
  { label: 'علوم حاسوب', value: 'computer_science' },
  { label: 'هندسة', value: 'engineering' },
];

// Occupations
export const diplomaOccupations: Item[] = [
  { label: 'مبرمج', value: 'programmer' },
  { label: 'مهندس', value: 'engineer' },
];

export const bachelorOccupations: Item[] = [
  { label: 'مبرمج', value: 'programmer' },
  { label: 'مهندس', value: 'engineer' },
];

export const masterOccupations: Item[] = [
  { label: 'مدير تقني', value: 'tech_manager' },
  { label: 'مهندس أول', value: 'senior_engineer' },
];

export const phdOccupations: Item[] = [
  { label: 'أستاذ مساعد', value: 'assistant_professor' },
  { label: 'باحث', value: 'researcher' },
];

export const professorOccupations: Item[] = [
  { label: 'أستاذ جامعي', value: 'university_professor' },
  { label: 'عميد كلية', value: 'dean' },
];

// Academic ranks
export const academicRanks: Item[] = [
  { label: 'أستاذ', value: 'professor' },
  { label: 'أستاذ مشارك', value: 'associate_professor' },
  { label: 'أستاذ مساعد', value: 'assistant_professor' },
];

// Generate completion years array
export const generateCompletionYears = (): Item[] => {
  const currentYear = new Date().getFullYear();
  const years: Item[] = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    years.push({ label: year.toString(), value: year.toString() });
  }
  return years;
};

// Generate future years for students
export const generateFutureYears = (): Item[] => {
  const currentYear = new Date().getFullYear();
  const years: Item[] = [];
  for (let year = currentYear; year <= currentYear + 10; year++) {
    years.push({ label: year.toString(), value: year.toString() });
  }
  return years;
}; 