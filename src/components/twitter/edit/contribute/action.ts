"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import type { ContributeSchema } from "./validation";
import { contributeSchema } from "./validation";

// Action result type
interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Get contribute data from the database
 */
export async function getContribute() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        contribute: true,
      }
    });

    return userData;
  } catch (error) {
    console.error("Error fetching contribute data:", error);
    return null;
  }
}

/**
 * Create new contribute data
 */
export async function createContribute(formData: ContributeSchema): Promise<ActionResult> {
  try {
    // Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User not found or not authenticated' };
    }

    // Validate form data
    const validatedData = contributeSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: 'البيانات المدخلة غير صحيحة' };
    }

    // Update user with contribute data
    await db.user.update({
      where: { id: user.id },
      data: {
        contribute: validatedData.data.contribute
      }
    });

    // Revalidate paths
    revalidatePath('/dashboard/profile/edit/contribute');

    return { success: true };
  } catch (error) {
    console.error('Error creating contribute data:', error);
    return { success: false, error: 'حدث خطأ أثناء حفظ البيانات' };
  }
}

/**
 * Update existing contribute data
 */
export async function updateContribute(formData: ContributeSchema): Promise<ActionResult> {
  try {
    // Authenticate user
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User not found or not authenticated' };
    }

    // Validate form data
    const validatedData = contributeSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: 'البيانات المدخلة غير صحيحة' };
    }

    // Update user with contribute data
    await db.user.update({
      where: { id: user.id },
      data: {
        contribute: validatedData.data.contribute
      }
    });

    // Revalidate paths
    revalidatePath('/dashboard/profile/edit/contribute');

    return { success: true };
  } catch (error) {
    console.error('Error updating contribute data:', error);
    return { success: false, error: 'حدث خطأ أثناء تحديث البيانات' };
  }
} 