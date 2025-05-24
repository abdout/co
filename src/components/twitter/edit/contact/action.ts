"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ContactSchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
};

// Create
export async function createContact(state: ActionState, data: ContactSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        twitter: data.twitter || '',
        facebook: data.facebook || '',
        linkedin: data.linkedin || '',
        link: data.link || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        onboardingStep: 2
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// Read
export async function getContact() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        phone: true,
        whatsapp: true,
        twitter: true,
        facebook: true,
        linkedin: true,
        link: true,
        telegram: true,
        instagram: true,
        tiktok: true,
      }
    });

    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Update
export async function updateContact(state: ActionState, data: ContactSchema) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        twitter: data.twitter || '',
        facebook: data.facebook || '',
        linkedin: data.linkedin || '',
        link: data.link || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        tiktok: data.tiktok || ''
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// Delete (Clear contact info)
export async function deleteContact() {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: true };

    await db.user.update({
      where: { id: user.id },
      data: {
        phone: null,
        whatsapp: null,
        twitter: null,
        facebook: null,
        linkedin: null,
        link: null,
        telegram: null,
        instagram: null,
        tiktok: null,
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
}

// For form submission from non-JS clients
