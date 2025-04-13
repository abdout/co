import { NextResponse } from "next/server";

// Debugging endpoint for Google auth configuration
export async function GET() {
  try {
    // Check environment variables (sanitized output for security)
    const googleClientIdStatus = process.env.GOOGLE_CLIENT_ID 
      ? `Set (${process.env.GOOGLE_CLIENT_ID.substring(0, 4)}...)` 
      : "Not set";
    
    const googleClientSecretStatus = process.env.GOOGLE_CLIENT_SECRET 
      ? "Set (hidden for security)" 
      : "Not set";
    
    // Get current domain for callback URL check
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.VERCEL_URL || 
                    "http://localhost:3000";
    
    const expectedCallbackUrl = `${baseUrl}/api/auth/callback/google`;
    
    return NextResponse.json({
      status: "ok",
      message: "Google auth configuration check",
      configuration: {
        clientId: googleClientIdStatus,
        clientSecret: googleClientSecretStatus,
        expectedCallbackUrl,
        baseUrl,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Google auth debug route error:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Error checking Google auth configuration",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 