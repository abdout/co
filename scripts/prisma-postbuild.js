#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Copy Prisma engine files to the correct location for Vercel deployment
const engineSourcePath = path.join(
  process.cwd(),
  'node_modules',
  '.prisma',
  'client'
);

const engineDestPath = path.join(
  process.cwd(),
  '.next',
  'server'
);

// Make sure destination directory exists
if (!fs.existsSync(engineDestPath)) {
  fs.mkdirSync(engineDestPath, { recursive: true });
}

// Copy engine files
try {
  if (fs.existsSync(engineSourcePath)) {
    console.log('Copying Prisma engine files to Next.js output directory...');
    
    // Copy all files from the source to destination
    const files = fs.readdirSync(engineSourcePath);
    
    files.forEach(file => {
      if (file.includes('engine')) {
        const sourcePath = path.join(engineSourcePath, file);
        const destPath = path.join(engineDestPath, file);
        
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file}`);
      }
    });
    
    console.log('Prisma engine files copied successfully');
  } else {
    console.error('Prisma engine source directory not found');
  }
} catch (error) {
  console.error('Error copying Prisma engine files:', error);
} 