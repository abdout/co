import { NextResponse } from "next/server";

// Debugging endpoint for Facebook auth configuration
export async function GET() {
  try {
    // Check environment variables (sanitized output for security)
    const facebookClientIdStatus = process.env.FACEBOOK_CLIENT_ID 
      ? `Set (${process.env.FACEBOOK_CLIENT_ID.substring(0, 4)}...)` 
      : "Not set";
    
    const facebookClientSecretStatus = process.env.FACEBOOK_CLIENT_SECRET 
      ? "Set (hidden for security)" 
      : "Not set";
    
    // Get current domain for callback URL check
    const baseUrl = process.env.NEXTAUTH_URL || 
                    process.env.VERCEL_URL || 
                    "http://localhost:3000";
    
    const expectedCallbackUrl = `${baseUrl}/api/auth/callback/facebook`;
    
    return NextResponse.json({
      status: "ok",
      message: "Facebook auth configuration check",
      configuration: {
        clientId: facebookClientIdStatus,
        clientSecret: facebookClientSecretStatus,
        expectedCallbackUrl,
        baseUrl,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Facebook auth debug route error:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Error checking Facebook auth configuration",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 