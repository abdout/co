const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build process failed:', error.message);
  process.exit(1);
} 