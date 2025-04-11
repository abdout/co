#!/usr/bin/env node
/**
 * This script is used during the Vercel deployment process to fix Prisma 
 * compatibility with Vercel's Lambda environment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running Vercel Prisma fix script');

// Generate Prisma Client (needed before copying engines)
console.log('✅ Generating Prisma Client');
execSync('npx prisma generate', { stdio: 'inherit' });

// Paths
const sourceEngineDir = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const targetEngineDir = path.join(process.cwd(), '.next', 'server');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetEngineDir)) {
  console.log(`📁 Creating directory: ${targetEngineDir}`);
  fs.mkdirSync(targetEngineDir, { recursive: true });
}

// Copy engine files
if (fs.existsSync(sourceEngineDir)) {
  console.log(`🔍 Looking for engine files in: ${sourceEngineDir}`);
  const files = fs.readdirSync(sourceEngineDir);
  
  console.log(`📃 Found files: ${files.join(', ')}`);
  
  let enginesCopied = 0;
  
  files.forEach(file => {
    // Copy engine files to the target directory
    if (file.includes('engine') || file.includes('libquery')) {
      const sourcePath = path.join(sourceEngineDir, file);
      const targetPath = path.join(targetEngineDir, file);
      
      console.log(`📦 Copying: ${file}`);
      fs.copyFileSync(sourcePath, targetPath);
      
      // Make it executable
      try {
        fs.chmodSync(targetPath, 0o755);
        console.log(`🔑 Made executable: ${file}`);
      } catch (err) {
        console.log(`⚠️ Could not make executable: ${file} (this might be normal on Windows)`);
      }
      
      enginesCopied++;
    }
  });
  
  console.log(`✅ Copied ${enginesCopied} engine files`);
} else {
  console.error('❌ Source engine directory not found!');
  process.exit(1);
}

console.log('✅ Vercel Prisma fix completed successfully'); 