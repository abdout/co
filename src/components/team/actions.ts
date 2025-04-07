'use server';

import { TeamFormValues, TeamMember } from './types';
import { revalidatePath } from 'next/cache';
import { auth } from '../../../auth';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This function should be defined before it's used by other functions
export async function synchronizeUserDataWithTeam(userId: string, teamId: string): Promise<void> {
  if (!userId || !teamId) {
    console.log("User ID or Team ID is missing:", { userId, teamId });
    return Promise.resolve();
  }

  try {
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        image: true
      }
    });

    if (!user) {
      console.log("User not found:", userId);
      return Promise.resolve();
    }

    // Update team with user data
    await prisma.team.update({
      where: { id: teamId },
      data: {
        users: {
          connect: { id: userId }
        },
        // Update fullname based on username if available
        fullname: user.username || ""
      }
    });

    console.log("User data synchronized with team:", { userId, teamId });
    return Promise.resolve();
  } catch (error) {
    console.error("Error synchronizing user data with team:", error);
    return Promise.resolve();
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    console.log('=== Fetching team members ===');
    
    // Attempt to get the current user, but don't block viewing team data
    let user;
    try {
      user = await currentUser();
      console.log('Current user:', user ? 'Authenticated' : 'Not authenticated');
    } catch (authError) {
      console.error('Authentication error:', authError);
      // Continue execution - we're allowing public access to team data
    }
    
    // Fetch teams directly using Prisma client
    console.log('Querying database for teams using Prisma client...');
    const teams = await db.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    console.log('Teams fetched successfully:', teams.length);
    
    // If we got no teams, return an empty array instead of an error
    if (!teams || teams.length === 0) {
      console.log('No teams found in database');
      return [];
    }
    
    // Map Prisma model to our TeamMember type
    const mappedResults = teams.map(team => {
      // Get the primary user if available
      const primaryUser = team.users?.[0];
      
      return {
        id: team.id,
        firstName: team.fullname?.split(' ')[0] || '',
        lastName: team.fullname?.split(' ')[1] || '',
        phone: team.phone || '',
        location: team.location || '',
        iqama: team.iqama || '',
        eligible: team.eligibility || [],
        // Include user data from related user
        userName: primaryUser?.username || '',
        userEmail: primaryUser?.email || '',
        userImage: primaryUser?.image || '',
      };
    });

    console.log('Teams mapped successfully:', mappedResults.length);
    return mappedResults;
  } catch (error) {
    console.error("Error getting team members:", error);
    // Return empty array instead of throwing, to prevent UI crashes
    console.log('Returning empty array due to error');
    return [];
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    console.log(`Fetching team member with ID: ${id}`);
    
    // Directly use Prisma client to find a team by ID with related user
    const team = await db.team.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    if (!team) {
      console.log(`No team found with ID: ${id}`);
      return null;
    }
    
    // Get the primary associated user if available
    const primaryUser = team.users?.[0];
    
    // Map Prisma model to our TeamMember type
    const result: TeamMember = {
      id: team.id,
      firstName: team.fullname?.split(' ')[0] || '',
      lastName: team.fullname?.split(' ')[1] || '',
      phone: team.phone || '',
      location: team.location || '',
      iqama: team.iqama || '',
      eligible: team.eligibility || [],
      // Include user data from related user
      userName: primaryUser?.username || '',
      userEmail: primaryUser?.email || '',
      userImage: primaryUser?.image || '',
    };
    
    return result;
  } catch (error) {
    console.error(`Error getting team member with ID ${id}:`, error);
    return null;
  }
}

export async function createTeamMember(data: TeamFormValues): Promise<TeamMember> {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    
    console.log('Creating new team member:', data.firstName, data.lastName);
    
    // Use Prisma client to create a team
    const team = await db.team.create({
      data: {
        fullname: `${data.firstName} ${data.lastName}`,
        phone: data.phone || undefined,
        location: data.location || undefined,
        iqama: data.iqama || undefined,
        eligibility: data.eligible || [],
        // Connect to the current user
        users: session.user.id ? {
          connect: { id: session.user.id }
        } : undefined
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    console.log('Team member created with ID:', team.id);
    
    // Get the user data from the included users relation
    const user = team.users?.[0] || session.user;
    
    // Map Prisma model to our TeamMember type
    const result: TeamMember = {
      id: team.id,
      firstName: team.fullname?.split(' ')[0] || '',
      lastName: team.fullname?.split(' ')[1] || '',
      phone: team.phone || '',
      location: team.location || '',
      iqama: team.iqama || '',
      eligible: team.eligibility || [],
      // Get username directly from the user object
      userName: user.username || '',
      userEmail: user.email || '',
      userImage: user.image || '',
    };
    
    // Synchronize user data with team if a user is connected
    if (session.user.id) {
      await synchronizeUserDataWithTeam(session.user.id, team.id);
    }
    
    // Revalidate the resource pages
    revalidatePath('/resource/team');
    
    return result;
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create team member");
  }
}

export async function updateTeamMember(id: string, data: TeamFormValues): Promise<TeamMember | null> {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    console.log('Updating team member:', id, data.firstName, data.lastName);
    
    // Use Prisma client to update a team by id
    const team = await db.team.update({
      where: { id },
      data: {
        fullname: `${data.firstName} ${data.lastName}`,
        phone: data.phone || undefined,
        location: data.location || undefined,
        iqama: data.iqama || undefined,
        eligibility: data.eligible || [],
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    console.log('Team member updated with ID:', team.id);
    
    // Get the user data if available
    const user = team.users && team.users.length > 0 ? team.users[0] : null;
    
    // Map Prisma model to our TeamMember type
    const result: TeamMember = {
      id: team.id,
      firstName: team.fullname?.split(' ')[0] || '',
      lastName: team.fullname?.split(' ')[1] || '',
      phone: team.phone || '',
      location: team.location || '',
      iqama: team.iqama || '',
      eligible: team.eligibility || [],
      // Get username directly from the user object
      userName: user?.username || '',
      userEmail: user?.email || '',
      userImage: user?.image || '',
    };
    
    // If there's a connected user, synchronize their data
    if (user && session.user.id) {
      await synchronizeUserDataWithTeam(session.user.id, team.id);
    }
    
    // Revalidate the resource pages
    revalidatePath('/resource/team');
    
    return result;
  } catch (error) {
    console.error(`Error updating team member with ID ${id}:`, error);
    return null;
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    
    console.log(`Deleting team member with ID: ${id}`);
    
    // Use Prisma client to delete a team
    await db.team.delete({
      where: { id }
    });
    
    console.log('Team member deleted successfully');
    
    // Revalidate the resource pages
    revalidatePath('/resource/team');
    
    // Add explicit return for void function
    return;
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete team member");
  }
}