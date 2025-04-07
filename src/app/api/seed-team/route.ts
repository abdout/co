import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Only allow in development to prevent accidental data creation in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ 
      success: false, 
      message: "This endpoint is only available in development mode" 
    }, { status: 403 });
  }

  try {
    console.log("Seeding team data...");
    
    // Create a test team member directly using Prisma client
    const team = await db.team.create({
      data: {
        fullname: "John Doe",
        src: "https://randomuser.me/api/portraits/men/1.jpg",
        alt: "John Doe profile image",
        phone: "+1-555-123-4567",
        whatsapp: "+1-555-123-4567",
        mail: "john.doe@example.com",
        location: "New York",
        width: 200,
        height: 200,
        iqama: "1234567890",
        eligibility: ["Project Management", "Leadership", "Technical"],
      }
    });
    
    console.log("Created test team member:", team);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Test team member created successfully",
      team 
    });
  } catch (error) {
    console.error("Failed to seed team data:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: `Failed to seed team data: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
} 