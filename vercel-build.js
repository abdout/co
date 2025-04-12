const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Verify Prisma client generation
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client');
  if (fs.existsSync(prismaClientPath)) {
    console.log('Prisma client generated successfully at:', prismaClientPath);
    
    // List contents of Prisma client directory
    const files = fs.readdirSync(prismaClientPath);
    console.log('Files in Prisma client directory:', files);
    
    // Check for engine files
    const engineFiles = files.filter(file => file.includes('engine'));
    console.log('Engine files found:', engineFiles);

    // Manually ensure Prisma engine files are copied to the appropriate location
    const engineDir = path.join(process.cwd(), 'node_modules/@prisma/client');
    if (!fs.existsSync(engineDir)) {
      fs.mkdirSync(engineDir, { recursive: true });
      console.log('Created directory:', engineDir);
    }
    
    // Copy the engine files
    engineFiles.forEach(file => {
      const sourcePath = path.join(prismaClientPath, file);
      const destPath = path.join(engineDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    });
  } else {
    console.error('Prisma client directory not found at:', prismaClientPath);
  }
  
  // Run Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build process failed:', error.message);
  process.exit(1);
} 