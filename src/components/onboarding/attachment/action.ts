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

    await db.team.update({
      where: { id: user.id },
      data: {
        image: data.image || '',
        resume: data.resume || '',
        iqama: data.iqama || '',
        sce: data.sce || '',
        passport: data.passport || '',
        drivingLicense: data.drivingLicense || '',
        
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

    const userData = await db.team.findUnique({
      where: { id: user.id },
      select: {
        image: true,
        resume: true,
        iqama: true,
        sce: true,
        passport: true,
        drivingLicense: true,
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

    await db.team.update({
      where: { id: user.id },
      data: {
        image: data.image || '',
        resume: data.resume || '',
        iqama: data.iqama || '',
        sce: data.sce || '',
        passport: data.passport || '',
        drivingLicense: data.drivingLicense || ''
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

    await db.team.update({
      where: { id: user.id },
      data: {
        image: null,
        resume: null,
        iqama: null,
        sce: null,
        passport: null,
        drivingLicense: null,
      }
    });

    revalidatePath("/lab");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
} 