import { PrismaClient } from "@prisma/client";
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// This disables the https connection pooling so we can do our own
neonConfig.fetchConnectionCache = false;

// Create a connection pool to reuse connections
const connectionString = process.env.DATABASE_URL as string;

// For edge runtime and serverless functions
function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });
}

// Add PrismaClient to the global namespace in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export db client
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
