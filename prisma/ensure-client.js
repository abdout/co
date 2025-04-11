const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate Prisma client
console.log('Ensuring Prisma client is properly generated...');

try {
  // Make sure the .prisma/client directory exists at project root
  const clientDir = path.join(process.cwd(), '.prisma/client');
  if (!fs.existsSync(clientDir)) {
    console.log('.prisma/client directory not found, creating it...');
    fs.mkdirSync(clientDir, { recursive: true });
  }

  // Generate the Prisma client
  console.log('Generating Prisma client...');
  execSync('prisma generate', { stdio: 'inherit' });

  // Check if default.js exists in the expected location
  const defaultJsPath = path.join(clientDir, 'default.js');
  if (!fs.existsSync(defaultJsPath)) {
    console.warn('Warning: default.js not found in .prisma/client, creating a reference...');
    
    // Create a minimal default.js that references the actual client
    const defaultJsContent = `
// This is a workaround for Next.js trying to import from .prisma/client/default
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.PrismaClient = void 0;
var prismaClient = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return prismaClient.PrismaClient; } });
Object.defineProperty(exports, "Prisma", { enumerable: true, get: function () { return prismaClient.Prisma; } });
`;
    fs.writeFileSync(defaultJsPath, defaultJsContent);
  }

  console.log('Prisma client setup complete');
} catch (error) {
  console.error('Error in Prisma client setup:', error);
  process.exit(1);
} 