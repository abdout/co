"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { UserSchema } from "./vaild";
import { auth } from "../../auth";

type CurrentState = { success: boolean; error: boolean };

export const createUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    await db.user.create({
      data: {
        name: data.name,
        // fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role,
        isTwoFactorEnabled: data.isTwoFactorEnabled,
        
        // Profile
        description: data.description,
        bio: data.bio,
        cv: data.cv,
        portfolio: data.portfolio,
        additionalFile: data.additionalFile,

        // Contact
        phone: data.phone,
        whatsapp: data.whatsapp,
        twitter: data.twitter,
        facebook: data.facebook,
        linkedin: data.linkedin,
        telegram: data.telegram,
        instagram: data.instagram,
        tiktok: data.tiktok,

        // Birthday & Locations
        birthDate: data.birthDate,
        birthCountry: data.birthCountry,
        birthState: data.birthState,
        birthLocality: data.birthLocality,
        birthAdminUnit: data.birthAdminUnit,
        birthNeighborhood: data.birthNeighborhood,
        birthMonth: data.birthMonth,
        birthYear: data.birthYear,

        // Current & Original Location
        currentCountry: data.currentCountry,
        currentState: data.currentState,
        currentLocality: data.currentLocality,
        currentAdminUnit: data.currentAdminUnit,
        currentNeighborhood: data.currentNeighborhood,
        originalCountry: data.originalCountry,
        originalState: data.originalState,
        originalLocality: data.originalLocality,
        originalAdminUnit: data.originalAdminUnit,
        originalNeighborhood: data.originalNeighborhood,

        // Personal Info
        nationalityId: data.nationalityId,
        maritalStatus: data.maritalStatus,
        gender: data.gender,
        religion: data.religion,

        // Education & Work
        educationLevel: data.educationLevel,
        institution: data.institution,
        yearOfCompletion: data.yearOfCompletion,
        currentOccupation: data.currentOccupation,
        employmentSector: data.employmentSector,
        workplaceAddress: data.workplaceAddress,

        // Student Details
        studentInstitution: data.studentInstitution,
        studentFaculty: data.studentFaculty,
        studentYear: data.studentYear,

        // Activities & Skills
        // politicalParty: data.politicalParty,
        // politicalMembership: data.politicalMembership,
        // socialActivityType: data.socialActivityType,
        // socialDescription: data.socialDescription,
        skills: data.skills,
        interests: data.interests,
        // languageSkills: data.languageSkills,

        // Emergency Contacts
        emergencyName1: data.emergencyName1,
        emergencyRelation1: data.emergencyRelation1,
        emergencyPhone1: data.emergencyPhone1,
        emergencyName2: data.emergencyName2,
        emergencyRelation2: data.emergencyRelation2,
        emergencyPhone2: data.emergencyPhone2,

        // Other
        referralSource: data.referralSource,
        acquaintanceName: data.acquaintanceName,
        donationAmount: data.donationAmount,
        donationDate: data.donationDate,
        oathAcknowledged: data.oathAcknowledged,
      },
    });

    revalidatePath("/users");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: true, message: "Not authenticated" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        // fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role,
        isTwoFactorEnabled: data.isTwoFactorEnabled,
        
        // Profile
        description: data.description,
        bio: data.bio,
        cv: data.cv,
        portfolio: data.portfolio,
        additionalFile: data.additionalFile,

        // Contact
        phone: data.phone,
        whatsapp: data.whatsapp,
        twitter: data.twitter,
        facebook: data.facebook,
        linkedin: data.linkedin,
        telegram: data.telegram,
        instagram: data.instagram,
        tiktok: data.tiktok,

        // Birthday & Locations
        birthDate: data.birthDate,
        birthCountry: data.birthCountry,
        birthState: data.birthState,
        birthLocality: data.birthLocality,
        birthAdminUnit: data.birthAdminUnit,
        birthNeighborhood: data.birthNeighborhood,
        birthMonth: data.birthMonth,
        birthYear: data.birthYear,

        // Current & Original Location
        currentCountry: data.currentCountry,
        currentState: data.currentState,
        currentLocality: data.currentLocality,
        currentAdminUnit: data.currentAdminUnit,
        currentNeighborhood: data.currentNeighborhood,
        originalCountry: data.originalCountry,
        originalState: data.originalState,
        originalLocality: data.originalLocality,
        originalAdminUnit: data.originalAdminUnit,
        originalNeighborhood: data.originalNeighborhood,

        // Personal Info
        nationalityId: data.nationalityId,
        maritalStatus: data.maritalStatus,
        gender: data.gender,
        religion: data.religion,

        // Education & Work
        educationLevel: data.educationLevel,
        institution: data.institution,
        yearOfCompletion: data.yearOfCompletion,
        currentOccupation: data.currentOccupation,
        employmentSector: data.employmentSector,
        workplaceAddress: data.workplaceAddress,

        // Student Details
        studentInstitution: data.studentInstitution,
        studentFaculty: data.studentFaculty,
        studentYear: data.studentYear,

        // Activities & Skills
        // politicalParty: data.politicalParty,
        // politicalMembership: data.politicalMembership,
        // socialActivityType: data.socialActivityType,
        // socialDescription: data.socialDescription,
        skills: data.skills,
        interests: data.interests,
        // languageSkills: data.languageSkills,

        // Emergency Contacts
        emergencyName1: data.emergencyName1,
        emergencyRelation1: data.emergencyRelation1,
        emergencyPhone1: data.emergencyPhone1,
        emergencyName2: data.emergencyName2,
        emergencyRelation2: data.emergencyRelation2,
        emergencyPhone2: data.emergencyPhone2,

        // Other
        referralSource: data.referralSource,
        acquaintanceName: data.acquaintanceName,
        donationAmount: data.donationAmount,
        donationDate: data.donationDate,
        oathAcknowledged: data.oathAcknowledged,

        // Onboarding
        onboardingStatus: data.isLastStep ? "COMPLETED" : "PENDING",
        onboardingStep: data.currentStep,
      },
    });

    revalidatePath("/users");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const deleteUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  
  try {
    await db.user.delete({
      where: { id },
    });

    revalidatePath("/users");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUsers = async () => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const updateProfile = async (
  currentState: { success: boolean; error: boolean },
  data: Partial<UserSchema>  // Make it partial to allow updating specific fields
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: true, message: "Not authenticated" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        fullname: data.fullname,
        bio: data.bio,
        phone: data.phone,
        whatsapp: data.whatsapp,
        twitter: data.twitter,
        facebook: data.facebook,
        linkedin: data.linkedin,
        telegram: data.telegram,
        instagram: data.instagram,
        tiktok: data.tiktok,
        currentCountry: data.currentCountry,
        currentState: data.currentState,
        currentLocality: data.currentLocality,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
