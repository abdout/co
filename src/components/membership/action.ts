// Server actions for membership application status and onboarding status
"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Approve application: sets applicationStatus to "APPROVED"
export async function approveApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "APPROVED",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });
  revalidatePath('/dashboard/membership');
  return { success: true };
}

// Reject application: sets applicationStatus to "REJECTED"
export async function rejectApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "REJECTED",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });
  revalidatePath('/dashboard/membership');
  return { success: true };
}

// Redo application: sets applicationStatus back to "PENDING"
export async function redoApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "PENDING",
      reviewedBy: null,
      reviewedAt: null,
    },
  });
  revalidatePath('/dashboard/membership');
  return { success: true };
}

// Set onboarding status (optional, for completeness)
export async function setOnboardingStatus(userId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      onboardingStatus: status,
    },
  });
  return { success: true };
}

// Set user role
export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });
    revalidatePath('/dashboard/membership');
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
