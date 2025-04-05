"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActivitySchema } from "./validation";

export type ActionState = {
  success: boolean;
  error: boolean;
  message?: string;
};

// Create or update eligibility
export async function createActivities(state: ActionState, data: ActivitySchema): Promise<ActionState> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { 
        success: false, 
        error: true, 
        message: "User not authenticated" 
      };
    }

    // Get user with teams relationship
    const userWithTeams = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    const existingTeamId = userWithTeams?.teams[0]?.id;

    // Find the user's team or create a new one if it doesn't exist
    const team = await db.team.upsert({
      where: {
        id: existingTeamId || "not-found" // Look for existing team
      },
      create: {
        fullname: user.name || '',
        eligibility: data.eligibility || [], // Allow empty array
        users: {
          connect: { id: user.id }
        }
      },
      update: {
        eligibility: data.eligibility || [], // Allow empty array
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error("[CREATE_ACTIVITIES]", error);
    return { 
      success: false, 
      error: true, 
      message: "Failed to create activities" 
    };
  }
}

// Read activities
export async function getActivities(): Promise<ActivitySchema | null> {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const teamData = await db.team.findFirst({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      },
      select: {
        eligibility: true,
      }
    });

    if (!teamData) return { eligibility: [] };

    return {
      eligibility: teamData.eligibility || [],
    };
  } catch (error) {
    console.error("[GET_ACTIVITIES]", error);
    return null;
  }
}

// Update activities
export async function updateActivities(_state: ActionState, data: ActivitySchema): Promise<ActionState> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { 
        success: false, 
        error: true, 
        message: "User not authenticated" 
      };
    }

    // Find the user's team
    const userWithTeam = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (!userWithTeam?.teams.length) {
      return {
        success: false,
        error: true,
        message: "No team found for this user"
      };
    }

    // Update the team
    await db.team.update({
      where: {
        id: userWithTeam.teams[0].id,
      },
      data: {
        eligibility: data.eligibility || [], // Allow empty array
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error("[UPDATE_ACTIVITIES]", error);
    return { 
      success: false, 
      error: true, 
      message: "Failed to update activities" 
    };
  }
}

// Delete activities
export async function deleteActivities(): Promise<ActionState> {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { 
        success: false, 
        error: true, 
        message: "User not authenticated" 
      };
    }

    // Find the user's team
    const userWithTeam = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    if (!userWithTeam?.teams.length) {
      return {
        success: false, 
        error: true, 
        message: "No team found for this user"
      };
    }

    // Update the team to clear eligibility
    await db.team.update({
      where: {
        id: userWithTeam.teams[0].id,
      },
      data: {
        eligibility: [],
      }
    });

    revalidatePath("/onboarding");
    return { success: true, error: false };
  } catch (error) {
    console.error("[DELETE_ACTIVITIES]", error);
    return { 
      success: false, 
      error: true, 
      message: "Failed to delete activities" 
    };
  }
} 