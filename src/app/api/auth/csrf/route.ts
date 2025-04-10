import { headers } from "next/headers";

// This API route is used to generate a CSRF token that will be used by NextAuth
// for the Facebook OAuth flow
export async function GET() {
  // Use Next.js headers API to get the host
  const headersList = headers();
  const host = headersList.get("host") || "";
  
  // Make a request to the NextAuth CSRF endpoint to initialize cookies
  const protocol = host.includes("localhost") ? "http" : "https";
  const csrfUrl = `${protocol}://${host}/api/auth/csrf`;
  
  try {
    const csrfResponse = await fetch(csrfUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!csrfResponse.ok) {
      throw new Error(`CSRF request failed: ${csrfResponse.statusText}`);
    }
    
    const csrf = await csrfResponse.json();
    
    return new Response(JSON.stringify({ csrfToken: csrf.csrfToken }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch CSRF token" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 