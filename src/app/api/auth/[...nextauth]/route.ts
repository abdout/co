import { GET, POST } from "../../../../../auth";

// Export handlers directly
export { GET, POST };

// Add custom error handling for all HTTP methods
export async function OPTIONS(request) {
  return new Response(null, { status: 200 });
}

// Fallback for any other methods
export async function HEAD(request) {
  return new Response(null, { status: 200 });
}
