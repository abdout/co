'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { notifyNewApplication } from '@/lib/notification';

// Keep full UserReviewData type for component use
export type UserReviewData = {
  // All fields needed for the component...
  // Personal info
  name?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  birthDate?: Date;
  birthCountry?: string;
  birthState?: string;
  birthLocality?: string;
  birthAdminUnit?: string;
  birthNeighborhood?: string;
  birthMonth?: number;
  birthYear?: number;
  description?: string;
  bio?: string;
  
  // Skills and Interests
  skills?: string[];
  interests?: string[];
  
  // Social Media
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  telegram?: string;
  instagram?: string;
  tiktok?: string;
  
  // Current location
  currentCountry?: string;
  currentState?: string;
  currentLocality?: string;
  currentAdminUnit?: string;
  currentNeighborhood?: string;
  
  // Original location
  originalCountry?: string;
  originalState?: string;
  originalLocality?: string;
  originalAdminUnit?: string;
  originalNeighborhood?: string;
  
  // Personal details
  nationalityId?: string;
  maritalStatus?: string;
  gender?: string;
  religion?: string;
  
  // Education & Work
  educationLevel?: string;
  institution?: string;
  yearOfCompletion?: number;
  major?: string;
  studentYear?: number;
  
  // Bachelor's information
  bachelorInstitution?: string;
  bachelorMajor?: string;
  bachelorCompletionYear?: number;
  
  // Master's information
  masterInstitution?: string;
  masterMajor?: string;
  masterCompletionYear?: number;
  
  // PhD information
  phdInstitution?: string;
  phdMajor?: string;
  phdCompletionYear?: number;
  
  // Professor information
  professorInstitution?: string;
  professorMajor?: string;
  professorCompletionYear?: number;
  
  // Current occupation
  currentOccupation?: string;
  employmentSector?: string;
  workplaceAddress?: string;
  companyName?: string;
  
  // Student Details
  studentInstitution?: string;
  studentFaculty?: string;
  
  // Activities
  partyMember?: boolean;
  partyName?: string;
  partyStartDate?: Date;
  partyEndDate?: Date;
  
  unionMember?: boolean;
  unionName?: string;
  unionStartDate?: Date;
  unionEndDate?: Date;
  
  ngoMember?: boolean;
  ngoName?: string;
  ngoActivity?: string;
  
  clubMember?: boolean;
  clubName?: string;
  clubType?: string;
  
  // Emergency Contacts
  emergencyName1?: string;
  emergencyRelation1?: string;
  emergencyPhone1?: string;
  emergencyName2?: string;
  emergencyRelation2?: string;
  emergencyPhone2?: string;
  
  // Other
  referralSource?: string;
  acquaintanceName?: string;
  donationAmount?: number;
  donationDate?: Date;
  oathAcknowledged?: boolean;
  
  // Attachments
  image?: string;
  cv?: string;
  portfolio?: string;
  additionalFile?: string;
  
  // System fields
  id?: string;
  role?: string;
  onboardingStatus?: string;
  onboardingStep?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Server action to fetch complete user data for the review page
 */
export async function fetchUserForReview(): Promise<{ error: string | null, data: UserReviewData | null }> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { error: "Unauthorized", data: null };
    }
    
    // Only select fields that are confirmed to exist in the schema
    const userData = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        // System fields
        id: true,
        name: true,
        fullname: true,
        email: true,
        role: true,
        onboardingStatus: true,
        onboardingStep: true,
        createdAt: true,
        updatedAt: true,
        
        // Personal info
        contribute: true,
        bio: true,
        phone: true,
        whatsapp: true,
        
        // Social Media
        twitter: true,
        facebook: true,
        linkedin: true,
        telegram: true,
        instagram: true,
        tiktok: true,
        
        // Personal details
        nationalityId: true,
        maritalStatus: true,
        gender: true,
        religion: true,
        
        // Birthday
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthLocality: true,
        birthAdminUnit: true,
        birthNeighborhood: true,
        birthMonth: true,
        birthYear: true,
        
        // Current Location
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        currentAdminUnit: true,
        currentNeighborhood: true,
        
        // Original Location
        originalCountry: true,
        originalState: true,
        originalLocality: true,
        originalAdminUnit: true,
        originalNeighborhood: true,
        
        // Education & Work
        educationLevel: true,
        studentYear: true,
        
        // Bachelor's information
        bachelorInstitution: true,
        bachelorMajor: true,
        bachelorCompletionYear: true,
        
        // Master's information
        masterInstitution: true,
        masterMajor: true,
        masterCompletionYear: true,
        
        // PhD information
        phdInstitution: true,
        phdMajor: true,
        phdCompletionYear: true,
        
        // Work information
        currentOccupation: true,
        employmentSector: true,
        workplaceAddress: true,
        companyName: true,
        
        // Student Details
        studentInstitution: true,
        studentFaculty: true,
        
        // Activities
        partyMember: true,
        partyName: true,
        partyStartDate: true,
        partyEndDate: true,
        
        unionMember: true,
        unionName: true,
        unionStartDate: true,
        unionEndDate: true,
        
        ngoMember: true,
        ngoName: true,
        ngoActivity: true,
        
        clubMember: true,
        clubName: true,
        clubType: true,
        
        // Emergency Contacts
        emergencyName1: true,
        emergencyRelation1: true,
        emergencyPhone1: true,
        emergencyName2: true,
        emergencyRelation2: true,
        emergencyPhone2: true,
        
        // Other
        referralSource: true,
        acquaintanceName: true,
        donationAmount: true,
        donationDate: true,
        oathAcknowledged: true,
        
        // Files
        image: true,
        cv: true,
        portfolio: true,
        cover: true,
        
        // Skills and Interests
        skills: true,
        interests: true,
      },
    });
    
    if (!userData) {
      return { error: "User not found", data: null };
    }
    
    console.log("Raw user data from DB:", userData);
    console.log("Skills in raw data:", userData.skills);
    console.log("Interests in raw data:", userData.interests);
    
    // Convert null values to undefined to match the UserReviewData type
    const cleanedData: UserReviewData = Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    ) as UserReviewData;
    
    console.log("Cleaned user data:", cleanedData);
    console.log("Skills in cleaned data:", cleanedData.skills);
    console.log("Interests in cleaned data:", cleanedData.interests);
    
    return { error: null, data: cleanedData };
  } catch (error) {
    console.error("Error fetching user data for review:", error);
    return { error: "Error fetching user data", data: null };
  }
}

/**
 * Server action to complete the onboarding process
 */
export async function completeOnboarding(): Promise<{ success: boolean, error: string | null }> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Get user details for notification
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        fullname: true,
        email: true,
        phone: true,
        whatsapp: true,
        image: true,
      }
    });
    
    // Update onboarding status
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: "COMPLETED",
        // Using a temporary workaround until Prisma schema is updated
        ...(process.env.NODE_ENV === 'production' ? {} : { applicationStatus: "PENDING" })
      }
    });
    
    // Get all membership secretaries and admins for notification
    const secretaries = await db.user.findMany({
      where: { role: "MEMBERSHIP" },
      select: { 
        email: true,
      }
    });
    
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { 
        email: true,
      }
    });
    
    // Combine emails without duplicates
    const secretaryEmails = secretaries.map(sec => sec.email).filter(Boolean) as string[];
    const adminEmails = admins.map(admin => admin.email).filter(Boolean) as string[];
    const uniqueNotificationEmails = [...new Set([...secretaryEmails, ...adminEmails])];
    
    if (uniqueNotificationEmails.length > 0 && userData) {
      // Send notification about new application
      await notifyNewApplication(
        uniqueNotificationEmails,
        userData.fullname || userData.name || "User",
        userData.email,
        userData.phone,
        userData.whatsapp
      );
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
} 