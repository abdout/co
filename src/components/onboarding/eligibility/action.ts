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

    // Find or create team entry for the user
    const team = await db.team.upsert({
      where: {
        id: user.id, // Using user.id as team.id for simplicity
      },
      create: {
        id: user.id,
        fullname: user.name || '',
        eligibility: data.eligibility,
        users: {
          connect: { id: user.id }
        }
      },
      update: {
        eligibility: data.eligibility,
      }
    });

    revalidatePath("/lab");
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

    await db.team.update({
      where: {
        id: user.id,
      },
      data: {
        eligibility: data.eligibility,
      }
    });

    revalidatePath("/lab");
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

    await db.team.update({
      where: {
        id: user.id,
      },
      data: {
        eligibility: [],
      }
    });

    revalidatePath("/lab");
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