'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

// Define TeamData type
export type TeamData = {
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
  cv?: string;  // Add cv field for form compatibility
  
  // Eligibility
  eligibility?: string[];
  
  // User info
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
};

/**
 * Server function to fetch team data
 */
export async function getTeamData(): Promise<{ error: string | null, data: TeamData | null }> {
  try {
    // Wrap this in a try/catch to better handle authentication errors
    let user;
    try {
      user = await currentUser();
    } catch (authError) {
      console.error("Error getting current user:", authError);
      return { 
        error: "Authentication error. Please try logging in again.", 
        data: null 
      };
    }
    
    if (!user) {
      return { 
        error: "You must be logged in to view this page", 
        data: null 
      };
    }
    
    if (!user.id) {
      console.error("User object exists but has no ID");
      return { 
        error: "Invalid user session. Please log in again.", 
        data: null 
      };
    }
    
    // Find the user with their team
    
    // Create a minimal data object in case of errors
    const fallbackData: TeamData = {
      fullname: user.name || 'New User',
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
      }
    };
    
    // Attempt to get the user with teams
    let userWithTeam;
    try {
      userWithTeam = await db.user.findUnique({
        where: { id: user.id },
        include: { teams: true }
      });
    } catch (dbError) {
      console.error("Database error when fetching user with teams:", dbError);
      return { 
        error: null, 
        data: fallbackData 
      };
    }
    
    // If user has no teams, return minimal data instead of error
    if (!userWithTeam || !userWithTeam.teams || userWithTeam.teams.length === 0) {
      return { 
        error: null, 
        data: fallbackData
      };
    }
    
    // Get detailed team data
    const teamId = userWithTeam.teams[0].id;
    
    let team;
    try {
      // Don't include users relation as we already have the current user
      team = await db.team.findUnique({
        where: { id: teamId }
      });
    } catch (dbError) {
      console.error("Database error when fetching team details:", dbError);
      return { 
        error: null, 
        data: {
          ...fallbackData,
          id: teamId
        } 
      };
    }
    
    // If team not found, return minimal data with team ID
    if (!team) {
      return { 
        error: null, 
        data: {
          ...fallbackData,
          id: teamId
        }
      };
    }
    
    // Format the data for the front-end
    const formattedData: TeamData = {
      // Basic info
      id: team.id,
      fullname: team.fullname || user.name || '',
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      
      // Contact info
      phone: team.phone || '',
      whatsapp: team.whatsapp || '',
      twitter: team.twitter || '',
      facebook: team.facebook || '',
      linkedin: team.linkedin || '',
      mail: team.mail || '',
      location: team.location || '',
      
      // Media
      src: team.src || '',
      alt: team.alt || '',
      width: team.width,
      height: team.height,
      image: team.image || '',
      
      // Documents
      iqama: team.iqama || '',
      sce: team.sce || '',
      passport: team.passport || '',
      drivingLicense: team.drivingLicense || '',
      cdl: team.cdl || '',
      license: team.license || '',
      resume: team.resume || '',
      // Look for cv in any available properties
      cv: (team as any).cv || '',
      
      // Eligibility
      eligibility: team.eligibility || [],
      
      // User info - use the current user data we already have instead of trying to access team.users
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
      }
    };
    
    return { error: null, data: formattedData };
  } catch (error) {
    console.error("Error in getTeamData:", error);
    // Return a generic data object instead of an error
    return { 
      error: null, 
      data: {
        fullname: "Error occurred, but you can still proceed",
        eligibility: []
      } 
    };
  }
} 