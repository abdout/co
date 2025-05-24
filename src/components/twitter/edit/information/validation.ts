import { z } from "zod";

export const informationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  fullname: z.string()
    .min(8, { message: "اكتب الاسم كامل بالعربية" })
    .regex(/^[\u0600-\u06FFa-zA-Z\s._-]*$/, { 
      message: "الاسم الكامل يمكن أن يحتوي على حروف عربية، إنجليزية وبعض الرموز" 
    })
    .optional(),
  // description: z.string().optional(),
  bio: z.string().optional(),
  birthMonth: z.union([z.string(), z.number()]).transform(val => val.toString()).optional(),
  birthYear: z.union([z.string(), z.number()]).transform(val => val.toString()).optional(),
  birthCountry: z.string().optional(),
  birthState: z.string().optional(),
  birthLocality: z.string().optional(),
  
  currentLocality: z.string().optional(),
  currentCountry: z.string().optional(),
  currentState: z.string().optional(),
  currentAdminUnit: z.string().optional(),
  currentNeighborhood: z.string().optional(),

  originalLocality: z.string().optional(),
  originalCountry: z.string().optional(),
  
  // Education fields
  educationLevel: z.string().optional(),
  
  // Common education fields
  institution: z.string().optional(),
  yearOfCompletion: z.string().optional(),
  major: z.string().optional(),
  currentOccupation: z.string().optional(),
  
  // Student fields
  studentInstitution: z.string().optional(),
  studentFaculty: z.string().optional(),
  studentProgram: z.string().optional(),
  studentYear: z.string().optional(),
  studentGraduationYear: z.string().optional(),
  
  // Diploma information
  diplomaInstitution: z.string().optional(),
  diplomaMajor: z.string().optional(),
  diplomaCompletionYear: z.string().optional(),
  
  // Bachelor's information
  bachelorInstitution: z.string().optional(),
  bachelorMajor: z.string().optional(),
  bachelorCompletionYear: z.string().optional(),
  
  // Master's information
  masterInstitution: z.string().optional(),
  masterMajor: z.string().optional(),
  masterCompletionYear: z.string().optional(),
  
  // PhD information
  phdInstitution: z.string().optional(),
  phdMajor: z.string().optional(),
  phdCompletionYear: z.string().optional(),
  
  // Professor information
  professorInstitution: z.string().optional(),
  professorMajor: z.string().optional(),
  professorCompletionYear: z.string().optional(),
  academicRank: z.string().optional(),
  
  // Occupation information
  employmentSector: z.string().optional(),
  companyName: z.string().optional(),
  workplaceAddress: z.string().optional(),
  
  // Other fields
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  religion: z.string().optional(),
  nationalityId: z.string().optional(),
});

export type InformationSchema = z.infer<typeof informationSchema>; 