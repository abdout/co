import { NextRequest, NextResponse } from "next/server";
import { GET as AuthGET, POST as AuthPOST } from "../../../../../auth";

export async function GET(request: NextRequest) {
  try {
    return await AuthGET(request);
  } catch (error) {
    console.error("Auth GET route error:", error);
    return new NextResponse(JSON.stringify({ error: "Authentication error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await AuthPOST(request);
  } catch (error) {
    console.error("Auth POST route error:", error);
    return new NextResponse(JSON.stringify({ error: "Authentication error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
