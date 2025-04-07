import { Metadata } from 'next'
import { db } from '@/lib/db'
import TeamPage from './client'

export const metadata: Metadata = {
  title: "Team Members | Company Underway",
  description: "View and manage team members",
};

// Fetch team data directly in the server component
async function getTeamData() {
  console.log('Fetching team data from server component');
  try {
    // Get teams directly from Prisma with user information
    const teams = await db.team.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullname: true,
        phone: true,
        location: true,
        iqama: true,
        eligibility: true,
        image: true,
        createdAt: true,
        updatedAt: true,
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
    
    console.log(`Found ${teams.length} team members`);
    
    // Map the data to include user information
    const mappedTeams = teams.map(team => {
      // Get the primary user if available
      const primaryUser = team.users?.[0];
      
      // Create a clean object with only the fields we need
      return {
        // Team data
        id: team.id,
        fullname: team.fullname,
        phone: team.phone,
        location: team.location,
        iqama: team.iqama,
        eligibility: team.eligibility,
        image: team.image,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        
        // User data in a separate object
        userData: primaryUser ? {
          email: primaryUser.email,
          // Use username directly
          username: primaryUser.username,
          image: primaryUser.image
        } : null
      };
    });
    
    return mappedTeams;
  } catch (error) {
    console.error('Error fetching team data:', error);
    return [];
  }
}

export default async function Team() {
  // Get data server-side for initial render
  const initialTeams = await getTeamData();
  
  return <TeamPage initialTeams={initialTeams} />
}