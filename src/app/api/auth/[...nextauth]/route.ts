import { GET, POST } from "../../../../../auth";

// Create middleware function to handle cookies
const cookieMiddleware = (handler) => async (request) => {
  // Clone the request to add the secure cookie settings
  const response = await handler(request);
  
  // Return the response with the handler
  return response;
};

// Export handlers with cookie middleware
export const GET_handler = cookieMiddleware(GET);
export const POST_handler = cookieMiddleware(POST);

// Alias exports
export { GET_handler as GET, POST_handler as POST };

// Handle preflight requests
export async function OPTIONS(request) {
  return new Response(null, { 
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://co.databayt.org",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-csrf-token",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400"
    }
  });
}

// Fallback for any other methods
export async function HEAD(request) {
  return new Response(null, { status: 200 });
}
