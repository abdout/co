'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { notifyNewApplication } from '@/lib/notification';
import { UserReviewData } from './type';

export type { UserReviewData };

/**
 * Server action to fetch complete user data for the review page
 */
export async function fetchUserForReview(): Promise<{ error: string | null, data: UserReviewData | null }> {
  try {
    const user = await currentUser();
    console.log("Current user:", user); // Debug log

    if (!user) {
      return { error: "Please sign in to continue", data: null };
    }

    if (!user.id) {
      return { error: "Invalid user session", data: null };
    }
    
    const userData = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        // System fields
        id: true,
        role: true,
        onboardingStatus: true,
        onboardingStep: true,
        createdAt: true,
        updatedAt: true,
        
        // Contact Information
        fullname: true,
        email: true,
        phone: true,
        whatsapp: true,
        
        // Eligibility Information
        nationalityId: true,
        maritalStatus: true,
        gender: true,
        religion: true,
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthLocality: true,
        
        // Attachment Information
        image: true,
        cv: true,
        portfolio: true,
        additionalFile: true,
      },
    });

    console.log("User data from DB:", userData); // Debug log

    if (!userData) {
      return { error: "User data not found", data: null };
    }

    return { error: null, data: userData };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Error loading data. Please try again.", data: null };
  }
}

/**
 * Server action to complete the onboarding process
 */
export async function completeOnboarding(): Promise<{ success: boolean, error: string | null }> {
  try {
    const user = await currentUser();
    console.log("Current user in completeOnboarding:", user); // Debug log

    if (!user) {
      return { success: false, error: "Please sign in to continue" };
    }

    if (!user.id) {
      return { success: false, error: "Invalid user session" };
    }

    // Update user onboarding status
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: "COMPLETED",
        onboardingStep: 3,
      },
    });

    // Send notification
    await notifyNewApplication(user.id);

    return { success: true, error: null };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, error: "Error completing registration. Please try again." };
  }
} 