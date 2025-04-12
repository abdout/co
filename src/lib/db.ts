import { PrismaClient } from "@prisma/client";
import { neon, neonConfig } from '@neondatabase/serverless';
import path from "path";
import fs from "fs";

// This disables the https connection pooling so we can do our own
neonConfig.fetchConnectionCache = false;

// Get connection string from environment variables
const connectionString = process.env.DATABASE_URL as string;

// Add prisma binary error handling for Vercel deployments
const handlePrismaClientInitialization = () => {
  try {
    // Try creating the default Prisma client
    return new PrismaClient();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('PrismaClientInitializationError') && 
          error.message.includes('could not locate the Query Engine')) {
        
        console.error('Attempting to recover from Prisma Engine error...');
        
        // Find all possible engine locations
        const possibleLocations = [
          path.join(process.cwd(), 'node_modules/.prisma/client'),
          path.join(process.cwd(), '.prisma/client'),
          path.join(process.cwd(), 'prisma/client'),
          path.join(process.cwd(), '.next/server'),
          path.join(process.cwd(), 'node_modules/@prisma/client')
        ];
        
        // Debug output to help diagnose the issue
        console.log('Looking for Prisma engine in:');
        possibleLocations.forEach(location => {
          const exists = fs.existsSync(location);
          console.log(`- ${location}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
          if (exists) {
            const files = fs.readdirSync(location);
            const engineFiles = files.filter(f => f.includes('engine'));
            console.log(`  Engine files: ${engineFiles.join(', ')}`);
          }
        });
        
        // Rethrow the error with more context
        throw new Error(`Prisma engine not found. Error: ${error.message}. Please ensure the Prisma engine is properly installed and the binaryTargets in schema.prisma includes "rhel-openssl-3.0.x".`);
      }
    }
    // For any other error, just rethrow it
    throw error;
  }
};

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { db: PrismaClient };

export const db = globalForPrisma.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

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
