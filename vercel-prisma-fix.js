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
execSync('pnpm prisma generate', { stdio: 'inherit' });

// Paths
// Use pnpm-specific path for Prisma client
const sourceEngineDir = path.join(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@6.5.0_prisma@6.5.0_typescript@5.7.3__typescript@5.7.3', 'node_modules', '.prisma', 'client');
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
  // Try alternative path as fallback
  const altSourceEngineDir = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
  
  if (fs.existsSync(altSourceEngineDir)) {
    console.log(`🔍 Looking for engine files in fallback location: ${altSourceEngineDir}`);
    const files = fs.readdirSync(altSourceEngineDir);
    
    console.log(`📃 Found files in alt location: ${files.join(', ')}`);
    
    let enginesCopied = 0;
    
    files.forEach(file => {
      if (file.includes('engine') || file.includes('libquery')) {
        const sourcePath = path.join(altSourceEngineDir, file);
        const targetPath = path.join(targetEngineDir, file);
        
        console.log(`📦 Copying from alt location: ${file}`);
        fs.copyFileSync(sourcePath, targetPath);
        
        try {
          fs.chmodSync(targetPath, 0o755);
        } catch (err) {
          console.log(`⚠️ Could not make executable: ${file}`);
        }
        
        enginesCopied++;
      }
    });
    
    console.log(`✅ Copied ${enginesCopied} engine files from alt location`);
  } else {
    console.error('❌ No Prisma engine directories found!');
    
    // List top node_modules to help debugging
    try {
      console.log('Contents of node_modules:');
      console.log(fs.readdirSync(path.join(process.cwd(), 'node_modules')).slice(0, 10).join(', ') + '...');
      
      if (fs.existsSync(path.join(process.cwd(), 'node_modules', '.pnpm'))) {
        console.log('Contents of node_modules/.pnpm:');
        console.log(fs.readdirSync(path.join(process.cwd(), 'node_modules', '.pnpm')).slice(0, 10).join(', ') + '...');
      }
    } catch (error) {
      console.error('Error listing directories:', error);
    }
    
    console.log('Continuing without engine copying...');
  }
}

console.log('✅ Vercel Prisma fix completed'); 