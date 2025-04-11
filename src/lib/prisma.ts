import { PrismaClient } from "@prisma/client";
import path from "path";

// Add prisma to the global type
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// In production, direct the Prisma client to look for engines
const prismaClientSingleton = () => {
  return new PrismaClient({
    // In production on Vercel, direct Prisma to find the engine
    ...(process.env.NODE_ENV === 'production' && {
      // Explicitly set the engine path for Vercel environment
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }),
  });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma; 