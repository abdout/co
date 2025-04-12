import { NextResponse } from "next/server";
import { db, debugPrismaEngine } from "@/lib/db";

// Debug endpoint to help diagnose Prisma deployment issues
export async function GET() {
  try {
    // Basic connection test
    const testQuery = await db.$queryRaw`SELECT 1 as alive`;
    
    // Get Prisma engine debug info
    const engineInfo = debugPrismaEngine();
    
    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL?.substring(0, 15) + "...",
      PRISMA_BINARY_TARGETS: process.env.PRISMA_BINARY_TARGETS,
      // Add any other relevant env vars (redacted for security)
    };
    
    return NextResponse.json({
      status: "ok",
      message: "Prisma connection successful",
      testQuery,
      engineInfo,
      environment: envInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Prisma debug endpoint error:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Failed to connect to database",
      error: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" 
        ? error instanceof Error ? error.stack : undefined
        : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 