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

    // Find existing teams for this user
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    console.log("Creating/updating attachment with data:", {
      image: data.image ? `${data.image.substring(0, 30)}...` : 'Not provided',
      resume: data.resume ? `${data.resume.substring(0, 30)}...` : 'Not provided',
      iqama: data.iqama ? `${data.iqama.substring(0, 30)}...` : 'Not provided',
      sce: data.sce ? `${data.sce.substring(0, 30)}...` : 'Not provided',
      passport: data.passport ? `${data.passport.substring(0, 30)}...` : 'Not provided',
      drivingLicense: data.drivingLicense ? `${data.drivingLicense.substring(0, 30)}...` : 'Not provided',
    });

    if (existingUser?.teams.length) {
      // Update existing team
      const updated = await db.team.update({
        where: { id: existingUser.teams[0].id },
        data: {
          image: data.image || '',
          resume: data.resume || '',
          iqama: data.iqama || '',
          sce: data.sce || '',
          passport: data.passport || '',
          drivingLicense: data.drivingLicense || '',
        }
      });
      console.log("Updated team with image:", updated.image ? `${updated.image.substring(0, 30)}...` : 'Empty');
    } else {
      // Create new team with user connection
      await db.team.create({
        data: {
          fullname: user.name || '',
          image: data.image || '',
          resume: data.resume || '',
          iqama: data.iqama || '',
          sce: data.sce || '',
          passport: data.passport || '',
          drivingLicense: data.drivingLicense || '',
          users: {
            connect: { id: user.id }
          }
        }
      });
    }

    revalidatePath("/onboarding");
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

    // Get user with teams
    const userWithTeams = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (!userWithTeams?.teams.length) return null;

    // Get team data
    const teamData = await db.team.findUnique({
      where: { id: userWithTeams.teams[0].id },
      select: {
        image: true,
        resume: true,
        iqama: true,
        sce: true,
        passport: true,
        drivingLicense: true,
      }
    });

    return teamData;
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

    // Get user with teams
    const userWithTeams = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (!userWithTeams?.teams.length) {
      return { success: false, error: true };
    }

    // Update team
    await db.team.update({
      where: { id: userWithTeams.teams[0].id },
      data: {
        image: data.image || '',
        resume: data.resume || '',
        iqama: data.iqama || '',
        sce: data.sce || '',
        passport: data.passport || '',
        drivingLicense: data.drivingLicense || ''
      }
    });

    revalidatePath("/onboarding");
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

    // Get user with teams
    const userWithTeams = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (!userWithTeams?.teams.length) {
      return { success: false, error: true };
    }

    // Update team to clear fields
    await db.team.update({
      where: { id: userWithTeams.teams[0].id },
      data: {
        image: null,
        resume: null,
        iqama: null,
        sce: null,
        passport: null,
        drivingLicense: null,
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
} 