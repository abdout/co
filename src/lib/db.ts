import { PrismaClient } from "@prisma/client";
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import path from 'path';

// This disables the https connection pooling so we can do our own
neonConfig.fetchConnectionCache = false;

// Create a connection pool to reuse connections
const connectionString = process.env.DATABASE_URL as string;

// For edge runtime and serverless functions
function createPrismaClient() {
  let prismaOptions: any = {
    datasources: {
      db: {
        url: connectionString,
      },
    },
  };

  // For Vercel's production environment
  if (process.env.NODE_ENV === 'production') {
    // Add custom binary target paths for Vercel rhel environment
    const queryCacheDir = path.join(process.cwd(), '.next/server');
    console.log('Looking for Prisma engines in:', queryCacheDir);
    
    try {
      // Log available files in the directory
      if (typeof window === 'undefined') {
        const fs = require('fs');
        if (fs.existsSync(queryCacheDir)) {
          console.log('Files in engine dir:', fs.readdirSync(queryCacheDir));
        } else {
          console.log('Engine directory does not exist');
        }
      }
    } catch (e) {
      console.error('Error checking engine directory:', e);
    }
  }

  return new PrismaClient(prismaOptions);
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
