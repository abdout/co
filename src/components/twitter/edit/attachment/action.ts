"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AttachmentSchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
};

// Create
export async function createAttachment(state: ActionState, data: AttachmentSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        image: data.image || '',
        cv: data.cv || '',
        portfolio: data.portfolio || '',
        cover: data.cover || '',
        onboardingStep: 3
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// Read
export async function getAttachment() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        image: true,
        cv: true,
        portfolio: true,
        cover: true,
      }
    });

    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Update
export async function updateAttachment(_state: ActionState, data: AttachmentSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        image: data.image || '',
        cv: data.cv || '',
        portfolio: data.portfolio || '',
        cover: data.cover || ''
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// Delete
export async function deleteAttachment() {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        image: null,
        cv: null,
        portfolio: null,
        cover: null,
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
} 