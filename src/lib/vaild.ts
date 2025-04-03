import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  fullname: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  password: z.string().min(8).optional().nullable(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  isTwoFactorEnabled: z.boolean().default(false),
  
  // Profile
  description: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  cv: z.string().optional().nullable(),
  portfolio: z.string().optional().nullable(),
  additionalFile: z.string().optional().nullable(),

  // Contact
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),

  // Birthday
  birthDate: z.coerce.date().optional().nullable(),
  birthCountry: z.string().optional().nullable(),
  birthState: z.string().optional().nullable(),
  birthLocality: z.string().optional().nullable(),
  birthAdminUnit: z.string().optional().nullable(),
  birthNeighborhood: z.string().optional().nullable(),
  birthMonth: z.coerce.number().optional().nullable(),
  birthYear: z.coerce.number().optional().nullable(),

  // Locations
  currentCountry: z.string().optional().nullable(),
  currentState: z.string().optional().nullable(),
  currentLocality: z.string().optional().nullable(),
  currentAdminUnit: z.string().optional().nullable(),
  currentNeighborhood: z.string().optional().nullable(),
  originalCountry: z.string().optional().nullable(),
  originalState: z.string().optional().nullable(),
  originalLocality: z.string().optional().nullable(),
  originalAdminUnit: z.string().optional().nullable(),
  originalNeighborhood: z.string().optional().nullable(),

  // Personal Info
  nationalityId: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),

  // Education & Work
  educationLevel: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  yearOfCompletion: z.coerce.number().optional().nullable(),
  currentOccupation: z.string().optional().nullable(),
  employmentSector: z.string().optional().nullable(),
  workplaceAddress: z.string().optional().nullable(),

  // Student Details
  studentInstitution: z.string().optional().nullable(),
  studentFaculty: z.string().optional().nullable(),
  studentYear: z.coerce.number().optional().nullable(),

  // Activities & Skills
  politicalParty: z.string().optional().nullable(),
  politicalMembership: z.string().optional().nullable(),
  socialActivityType: z.string().optional().nullable(),
  socialDescription: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  languageSkills: z.array(z.string()).optional().default([]),

  // Emergency Contacts
  emergencyName1: z.string().optional().nullable(),
  emergencyRelation1: z.string().optional().nullable(),
  emergencyPhone1: z.string().optional().nullable(),
  emergencyName2: z.string().optional().nullable(),
  emergencyRelation2: z.string().optional().nullable(),
  emergencyPhone2: z.string().optional().nullable(),

  // Other
  referralSource: z.string().optional().nullable(),
  acquaintanceName: z.string().optional().nullable(),
  donationAmount: z.number().optional().nullable(),
  donationDate: z.coerce.date().optional().nullable(),
  oathAcknowledged: z.boolean().optional().nullable(),

  // Onboarding
  isLastStep: z.boolean().optional(),
  currentStep: z.number().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
