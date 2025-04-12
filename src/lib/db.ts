import { PrismaClient } from "@prisma/client";
import { neon, neonConfig } from '@neondatabase/serverless';

// This disables the https connection pooling so we can do our own
neonConfig.fetchConnectionCache = false;

// Get connection string from environment variables
const connectionString = process.env.DATABASE_URL as string;

// Prisma client creation with error handling
function createPrismaClient() {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
      // Log queries in development
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    // Fallback to a basic client with minimal options
    return new PrismaClient();
  }
}

// Add PrismaClient to the global namespace to prevent multiple instances in development
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export db client - cache client in development, create new in production
export const db = globalForPrisma.prisma ?? createPrismaClient();

// Keep one connection open in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// For debugging Prisma issues
export function debugPrismaEngine() {
  try {
    const enginePath = (db as any)._engine?.binaryPath ?? "Unknown binary path";
    console.log("Prisma binary path:", enginePath);
    
    const engines = (db as any)._getActiveEngineInstances?.() ?? [];
    console.log("Active engine instances:", engines.length);
    
    console.log("Prisma connection URL:", connectionString?.substring(0, 20) + "...");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    
    return { enginePath, engines: engines.length };
  } catch (error) {
    console.error("Failed to debug Prisma engine:", error);
    return { error: error?.toString() };
  }
}
