import { db } from "@/lib/db";
import { TeamFormValues } from "./types";

/**
 * Create a new Team member
 */
export async function createTeamInDb(data: TeamFormValues) {
  return db.team.create({
    data: {
      id: data.id || undefined,
      fullname: data.firstName + ' ' + data.lastName,
      src: data.src || undefined,
      alt: data.alt || `${data.firstName} ${data.lastName}`,
      phone: data.phone || undefined,
      whatsapp: data.whatsapp || undefined,
      twitter: data.twitter || undefined,
      facebook: data.facebook || undefined,
      linkedin: data.linkedin || undefined,
      mail: data.mail || undefined,
      location: data.location || undefined,
      width: data.width || undefined,
      height: data.height || undefined,
      image: data.image || undefined,
      iqama: data.iqama || undefined,
      sce: data.sce || undefined,
      passport: data.passport || undefined,
      drivingLicense: data.drivingLicense || undefined,
      cdl: data.cdl || undefined,
      license: data.license || undefined,
      resume: data.resume || undefined,
      eligibility: data.eligible || [],
    },
  });
}

/**
 * Find all Team members with optional filtering
 */
export async function findTeams(options: { 
  orderBy?: 'createdAt' | 'fullname'; 
  orderDir?: 'asc' | 'desc';
  take?: number;
} = {}) {
  const { 
    orderBy = 'createdAt', 
    orderDir = 'desc',
    take
  } = options;
  
  console.log('=== Starting database query ===');
  console.log('Query options:', { orderBy, orderDir, take });
  
  try {
    // Check if db is available
    if (!db) {
      console.error('Database connection not available');
      throw new Error('Database connection not available');
    }
    
    console.log('Database connection is available');
    
    // Validate that Team model exists in Prisma
    try {
      // This is just to verify the model exists
      await db.team.count();
      console.log('Team model exists in the database');
    } catch (error) {
      console.error('Error validating Team model:', error);
      throw new Error(`Team model validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Execute the actual query
    const results = await db.team.findMany({
      orderBy: { [orderBy]: orderDir },
      take: take || undefined,
    });
    
    console.log(`Query successful, found ${results.length} team members`);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Error details:', error instanceof Error ? error.stack : 'No stack trace available');
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Find a Team member by ID
 */
export async function findTeamById(id: string) {
  return db.team.findUnique({
    where: { id },
  });
}

/**
 * Update a Team member
 */
export async function updateTeamInDb(id: string, data: Partial<TeamFormValues>) {
  const updateData: any = { ...data };
  
  // If first or last name is updated, update fullname
  if (data.firstName || data.lastName) {
    const currentTeam = await findTeamById(id);
    const firstName = data.firstName || (currentTeam?.fullname?.split(' ')[0] || '');
    const lastName = data.lastName || (currentTeam?.fullname?.split(' ')[1] || '');
    updateData.fullname = `${firstName} ${lastName}`;
  }
  
  // If eligible array is provided, update eligibility
  if (data.eligible) {
    updateData.eligibility = data.eligible;
  }
  
  return db.team.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete a Team member
 */
export async function deleteTeamFromDb(id: string) {
  return db.team.delete({
    where: { id },
  });
} 