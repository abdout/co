import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db-direct";

// Direct database query endpoint for checking connection without Prisma
export async function GET() {
  try {
    // Test direct connection
    const connectionStatus = await checkDbConnection();
    
    return NextResponse.json({
      status: connectionStatus.connected ? "ok" : "error",
      message: connectionStatus.connected 
        ? "Direct database connection successful" 
        : "Failed to connect to database using direct connection",
      connectionStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Direct database connection error:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Failed to connect to database using direct connection",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 