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

    // Find existing teams for this user
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (existingUser?.teams.length) {
      // Update existing team
      await db.team.update({
        where: { id: existingUser.teams[0].id },
        data: {
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          twitter: data.twitter || '',
          facebook: data.facebook || '',
          linkedin: data.linkedin || '',
          // Note: telegram, instagram, tiktok fields exist in schema validation
          // but not in the Team model. They would need to be added to the
          // prisma schema if needed.
        }
      });
    } else {
      // Create new team with user connection
      await db.team.create({
        data: {
          fullname: user.name || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          twitter: data.twitter || '',
          facebook: data.facebook || '',
          linkedin: data.linkedin || '',
          // Note: telegram, instagram, tiktok fields exist in schema validation
          // but not in the Team model. They would need to be added to the
          // prisma schema if needed.
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
export async function getContact() {
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
        phone: true,
        whatsapp: true,
        twitter: true,
        facebook: true,
        linkedin: true,
      }
    });

    return teamData;
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
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        twitter: data.twitter || '',
        facebook: data.facebook || '',
        linkedin: data.linkedin || '',
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
export async function deleteContact() {
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
        phone: null,
        whatsapp: null,
        twitter: null,
        facebook: null,
        linkedin: null,
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
