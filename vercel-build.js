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
    
    // Get all engine files
    const engineFiles = files.filter(file => file.includes('engine'));
    console.log('Engine files found:', engineFiles);

    // Copy engine files to multiple locations to ensure Vercel can find them
    const destinationPaths = [
      path.join(process.cwd(), 'node_modules/@prisma/client'),
      path.join(process.cwd(), '.prisma/client'),
      path.join(process.cwd(), 'prisma/client'),
      path.join(process.cwd(), '.next/server'),
    ];
    
    // Create destination directories and copy engines
    destinationPaths.forEach(destDir => {
      try {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
          console.log(`Created directory: ${destDir}`);
        }
        
        // Copy the engine files
        engineFiles.forEach(file => {
          const sourcePath = path.join(prismaClientPath, file);
          const destPath = path.join(destDir, file);
          
          try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copied ${file} to ${destPath}`);
          } catch (copyError) {
            console.error(`Error copying ${file} to ${destPath}:`, copyError.message);
          }
        });
      } catch (dirError) {
        console.error(`Error with directory ${destDir}:`, dirError.message);
      }
    });
    
    // Special handling for pnpm structure
    const pnpmPath = path.join(process.cwd(), 'node_modules/.pnpm/@prisma+client');
    if (fs.existsSync(pnpmPath)) {
      console.log('pnpm directory found at:', pnpmPath);
      
      // Find all prisma client directories in pnpm structure
      const dirs = fs.readdirSync(pnpmPath);
      dirs.forEach(dir => {
        const clientDir = path.join(pnpmPath, dir, 'node_modules/.prisma/client');
        if (!fs.existsSync(clientDir)) {
          fs.mkdirSync(clientDir, { recursive: true });
          console.log(`Created pnpm client directory: ${clientDir}`);
          
          // Copy the engine files
          engineFiles.forEach(file => {
            const sourcePath = path.join(prismaClientPath, file);
            const destPath = path.join(clientDir, file);
            try {
              fs.copyFileSync(sourcePath, destPath);
              console.log(`Copied ${file} to pnpm structure: ${destPath}`);
            } catch (copyError) {
              console.error(`Error copying to pnpm structure:`, copyError.message);
            }
          });
        }
      });
    }
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