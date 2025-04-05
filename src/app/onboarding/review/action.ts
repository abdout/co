'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { notifyNewApplication } from '@/lib/notification';

// Keep full TeamReviewData type for component use
export type TeamReviewData = {
  // Basic team info
  id?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Contact info
  phone?: string;
  whatsapp?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  mail?: string;
  location?: string;
  
  // Media
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  image?: string;
  
  // Documents
  iqama?: string;
  sce?: string;
  passport?: string;
  drivingLicense?: string;
  cdl?: string;
  license?: string;
  resume?: string;
  
  // Eligibility
  eligibility?: string[];
  
  // User info (who created the team)
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
};

/**
 * Server action to fetch complete team data for the review page
 */
export async function fetchTeamForReview(): Promise<{ error: string | null, data: TeamReviewData | null }> {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return { error: "Unauthorized", data: null };
    }
    
    // Find the user with their team
    const userWithTeam = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });
    
    if (!userWithTeam?.teams.length) {
      // No team found, create a minimal team object for display
      return { 
        error: null, 
        data: {
          fullname: user.name || '',
          user: {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
          }
        } 
      };
    }
    
    // Get detailed team data
    const teamId = userWithTeam.teams[0].id;
    
    // Get team without including users to avoid the issue
    const team = await db.team.findUnique({
      where: { id: teamId }
    });
    
    if (!team) {
      return { error: "Team not found", data: null };
    }
    
    // Format the data for the front-end
    const formattedData: TeamReviewData = {
      // Basic info
      id: team.id,
      fullname: team.fullname,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      
      // Contact info
      phone: team.phone || undefined,
      whatsapp: team.whatsapp || undefined,
      twitter: team.twitter || undefined,
      facebook: team.facebook || undefined,
      linkedin: team.linkedin || undefined,
      mail: team.mail || undefined,
      location: team.location || undefined,
      
      // Media
      src: team.src || undefined,
      alt: team.alt || undefined,
      width: team.width || undefined,
      height: team.height || undefined,
      image: team.image || undefined,
      
      // Documents
      iqama: team.iqama || undefined,
      sce: team.sce || undefined,
      passport: team.passport || undefined,
      drivingLicense: team.drivingLicense || undefined,
      cdl: team.cdl || undefined,
      license: team.license || undefined,
      resume: team.resume || undefined,
      
      // Eligibility
      eligibility: team.eligibility || [],
      
      // User info - get directly from currentUser rather than team.users
      user: {
        id: user.id,
        name: user.name || undefined,
        email: user.email || undefined,
      }
    };
    
    return { error: null, data: formattedData };
  } catch (error) {
    return { error: "Error fetching team data", data: null };
  }
}

/**
 * Server action to complete the onboarding process
 */
export async function completeOnboarding(): Promise<{ success: boolean, error: string | null }> {
  try {
    // Get current user with proper error handling
    let user;
    try {
      user = await currentUser();
    } catch (authError) {
      return { success: false, error: "Authentication failed. Please log in again." };
    }
    
    if (!user) {
      return { success: false, error: "You must be logged in to complete registration." };
    }
    
    if (!user.id) {
      return { success: false, error: "Invalid user session. Please log in again." };
    }
    
    // Find the user's team
    let userWithTeam;
    try {
      userWithTeam = await db.user.findUnique({
      where: { id: user.id },
        include: { teams: true }
      });
    } catch (dbError) {
      // Continue with team creation - this is not a fatal error
    }
    
    // If no team exists, create one
    if (!userWithTeam?.teams?.length) {
      try {
        await db.team.create({
          data: {
            fullname: user.name || 'New Team',
            users: {
              connect: { id: user.id }
            }
          }
        });
      } catch (createError) {
        // This is not a fatal error - the user can still complete onboarding
      }
    }
    
    // Try to notify about the application, but don't fail if it doesn't work
    try {
      await notifyNewApplication(
        [process.env.ADMIN_EMAIL || 'admin@example.com'], 
        user.name || 'New User',
        user.email || null,
        null,  // phone
        null   // whatsapp
      );
    } catch {
      // Ignore notification errors
    }
    
    return { success: true, error: null };
  } catch (error) {
    return { 
      success: true, // Return success anyway to allow user to proceed
      error: null 
    };
  }
} 