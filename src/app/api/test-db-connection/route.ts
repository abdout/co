import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test connection by running simple queries on all models
    const testsResults = await Promise.allSettled([
      testTeamModel(),
      testUserModel(),
      testNeonConnection()
    ]);
    
    const results = {
      team: testsResults[0].status === 'fulfilled' ? testsResults[0].value : { error: 'Test failed' },
      user: testsResults[1].status === 'fulfilled' ? testsResults[1].value : { error: 'Test failed' },
      neon: testsResults[2].status === 'fulfilled' ? testsResults[2].value : { error: 'Test failed' }
    };
    
    const anySuccess = Object.values(results).some(r => r.success);
    
    return NextResponse.json({ 
      success: anySuccess, 
      message: anySuccess ? "Database connection successful for at least one model" : "All database tests failed",
      databaseUrl: maskDatabaseUrl(process.env.DATABASE_URL || ''),
      tests: results
    }, { status: anySuccess ? 200 : 500 });
  } catch (error) {
    console.error("Database connection test failed:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
      databaseUrl: maskDatabaseUrl(process.env.DATABASE_URL || '') 
    }, { status: 500 });
  }
}

// Check if the Team model exists and works
async function testTeamModel() {
  try {
    // Try to count teams
    const count = await db.team.count();
    
    // Try to get one team record if count > 0
    let sample = null;
    if (count > 0) {
      const teams = await db.team.findMany({ take: 1 });
      sample = teams.length > 0 ? {
        id: teams[0].id,
        fullname: teams[0].fullname
      } : null;
    }
    
    return { 
      success: true, 
      count,
      sample
    };
  } catch (error) {
    console.error("Error testing Team model:", error);
    return { 
      success: false, 
      error: String(error) 
    };
  }
}

// Check if the User model exists and works
async function testUserModel() {
  try {
    // Try to count users
    const count = await db.user.count();
    return { success: true, count };
  } catch (error) {
    console.error("Error testing User model:", error);
    return { success: false, error: String(error) };
  }
}

// Test raw connection to Neon database
async function testNeonConnection() {
  try {
    // Try a simple query that should work on any Postgres database
    const result = await db.$queryRaw`SELECT current_timestamp as time, current_database() as database`;
    return { 
      success: true, 
      connectionInfo: result 
    };
  } catch (error) {
    console.error("Error testing raw Neon connection:", error);
    return { success: false, error: String(error) };
  }
}

// Mask sensitive parts of the database URL for security
function maskDatabaseUrl(url: string) {
  if (!url) return 'Not provided';
  
  try {
    // Create a URL object to parse the connection string
    const parsedUrl = new URL(url);
    
    // Mask password
    if (parsedUrl.password) {
      parsedUrl.password = '********';
    }
    
    // Return the masked URL
    return parsedUrl.toString();
  } catch (error) {
    // If URL parsing fails, return a more basic masked version
    return url.replace(/\/\/[^:]+:[^@]+@/, '//********:********@');
  }
} 