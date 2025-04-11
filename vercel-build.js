const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the build command
console.log('Running build command...');
execSync('next build', { stdio: 'inherit' });

// Generate Prisma Client specifically for rhel-openssl-3.0.x
console.log('Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Get the output directory where Prisma engines are stored
const engineDir = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
const targetEngineDir = path.join(process.cwd(), '.next', 'server');

// Ensure target directory exists
if (!fs.existsSync(targetEngineDir)) {
  fs.mkdirSync(targetEngineDir, { recursive: true });
}

// Copy all engine files
if (fs.existsSync(engineDir)) {
  console.log('Copying Prisma engines to server directory...');
  const files = fs.readdirSync(engineDir);
  
  files.forEach(file => {
    // Copy engine files
    if (file.includes('engine')) {
      const src = path.join(engineDir, file);
      const dest = path.join(targetEngineDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to server directory`);
    }
  });
}

console.log('Build completed'); 