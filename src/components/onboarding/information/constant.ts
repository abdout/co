import { Option } from "@/components/atom/auto-complete";

// Countries data for both location and birthdate components
export const COUNTRIES: Option[] = [
  { value: "sudan", label: "السودان" },
  { value: "egypt", label: "مصر" },
  { value: "saudi_arabia", label: "السعودية" },
  { value: "jordan", label: "الأردن" },
  { value: "libya", label: "ليبيا" },
  { value: "south_sudan", label: "جنوب السودان" },
  { value: "eritrea", label: "إريتريا" },
  { value: "yemen", label: "اليمن" },
];

// States/provinces by country
export const STATES: Record<string, Option[]> = {
  "sudan": [
    { value: "khartoum_state", label: "ولاية الخرطوم" },
    { value: "river_nile", label: "نهر النيل" },
    { value: "kassala", label: "كسلا" }
  ],
  "egypt": [
    { value: "cairo_gov", label: "محافظة القاهرة" },
    { value: "alexandria_gov", label: "محافظة الإسكندرية" },
    { value: "luxor_gov", label: "محافظة الأقصر" }
  ],
  "saudi_arabia": [
    { value: "riyadh_province", label: "منطقة الرياض" },
    { value: "makkah_province", label: "منطقة مكة المكرمة" },
    { value: "eastern_province", label: "المنطقة الشرقية" }
  ],
  "jordan": [
    { value: "amman_gov", label: "محافظة عمان" },
    { value: "zarqa_gov", label: "محافظة الزرقاء" },
    { value: "irbid_gov", label: "محافظة إربد" }
  ],
  "libya": [
    { value: "tripoli_gov", label: "محافظة طرابلس" },
    { value: "benghazi_gov", label: "محافظة بنغازي" },
    { value: "misrata_gov", label: "محافظة مصراتة" }
  ],
  "south_sudan": [
    { value: "central_equatoria", label: "ولاية الاستوائية الوسطى" },
    { value: "jonglei", label: "ولاية جونقلي" },
    { value: "unity", label: "ولاية الوحدة" }
  ],
  "eritrea": [
    { value: "maekel", label: "إقليم ماكل" },
    { value: "anseba", label: "إقليم عنسبا" },
    { value: "gash_barka", label: "إقليم قاش بركة" }
  ],
  "yemen": [
    { value: "sanaa_gov", label: "محافظة صنعاء" },
    { value: "aden_gov", label: "محافظة عدن" },
    { value: "taiz_gov", label: "محافظة تعز" }
  ]
};

// Localities (larger city areas) by state
export const LOCALITIES: Record<string, Option[]> = {
  "khartoum_state": [
    { value: "khartoum_locality", label: "محلية الخرطوم" },
    { value: "omdurman_locality", label: "محلية أم درمان" },
    { value: "bahri_locality", label: "محلية بحري" }
  ],
  "river_nile": [
    { value: "atbara_locality", label: "محلية عطبرة" },
    { value: "damar_locality", label: "محلية الدامر" },
    { value: "shendi_locality", label: "محلية شندي" }
  ],
  "cairo_gov": [
    { value: "cairo_east", label: "القاهرة الشرقية" },
    { value: "cairo_west", label: "القاهرة الغربية" },
    { value: "cairo_central", label: "وسط القاهرة" }
  ],
  "riyadh_province": [
    { value: "riyadh_city_area", label: "منطقة مدينة الرياض" },
    { value: "diriyah_area", label: "منطقة الدرعية" },
    { value: "kharj_area", label: "منطقة الخرج" }
  ],
};

// Admin units (smaller administrative divisions) by locality - Used only in location component
export const ADMIN_UNITS: Record<string, Option[]> = {
  "khartoum_locality": [
    { value: "khartoum_downtown", label: "وسط الخرطوم" },
    { value: "khartoum_east", label: "شرق الخرطوم" },
    { value: "khartoum_south", label: "جنوب الخرطوم" }
  ],
  "omdurman_locality": [
    { value: "omdurman_central", label: "وسط أم درمان" },
    { value: "omdurman_north", label: "شمال أم درمان" },
    { value: "karari", label: "كرري" }
  ],
  "cairo_east": [
    { value: "nasr_city", label: "مدينة نصر" },
    { value: "heliopolis", label: "مصر الجديدة" },
    { value: "maadi", label: "المعادي" }
  ],
  "riyadh_city_area": [
    { value: "olaya_district", label: "حي العليا" },
    { value: "malaz_district", label: "حي الملز" },
    { value: "sulaimaniyah_district", label: "حي السليمانية" }
  ],
};

// Neighborhoods by admin unit - Used only in location component
export const NEIGHBORHOODS: Record<string, Option[]> = {
  "khartoum_downtown": [
    { value: "almogran", label: "المقرن" },
    { value: "riyadh_khartoum", label: "الرياض" },
    { value: "alshaheed", label: "الشهيد" }
  ],
  "khartoum_east": [
    { value: "alsahafa", label: "الصحافة" },
    { value: "burri", label: "بري" },
    { value: "almamoura", label: "المعمورة" }
  ],
  "nasr_city": [
    { value: "first_zone", label: "المنطقة الأولى" },
    { value: "seventh_zone", label: "المنطقة السابعة" },
    { value: "eighth_zone", label: "المنطقة الثامنة" }
  ],
  "olaya_district": [
    { value: "olaya_north", label: "العليا الشمالية" },
    { value: "olaya_center", label: "وسط العليا" },
    { value: "olaya_south", label: "العليا الجنوبية" }
  ],
};

// Birth months with Arabic names - Used only in birthdate component
export const BIRTH_MONTHS: Option[] = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "ابريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "اغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "اكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" }
];

// Generate birth years (100 years from current year) - Helper function for birthdate component
export const generateBirthYears = (): Option[] => {
  return Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });
};

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
  { value: '1', label: 'الاولي' },
  { value: '2', label: 'الثانية' },
  { value: '3', label: 'الثالثة' },
  { value: '4', label: 'الرابعة' },
  { value: '5', label: 'الخامسة' },
  { value: '6', label: 'السادسة' },
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