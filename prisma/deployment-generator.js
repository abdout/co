// This file is used to ensure Prisma generates the correct binary for Vercel's environment
const { exec } = require('child_process');

// Run prisma generate with specific configuration for Vercel deployment
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during Prisma generation: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Prisma generation stderr: ${stderr}`);
    return;
  }
  console.log(`Prisma Client successfully generated: ${stdout}`);
}); 