'use server';

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { activities } from '../constant';

const execAsync = promisify(exec);

export async function generateMosContent() {
  try {
    // Check if we're in production environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, we can't execute scripts directly
      // Instead, generate the content in memory and return it
      return { 
        success: true, 
        message: 'In production, MOS content should be pre-generated during build.' 
      };
    }
    
    // In development, run the script
    // Ensure content/mos directory exists
    const mosDir = path.join(process.cwd(), 'content', 'mos');
    if (!fs.existsSync(mosDir)) {
      fs.mkdirSync(mosDir, { recursive: true });
    }

    // Run the generation script
    const { stdout, stderr } = await execAsync('pnpm generate-mos');
    
    if (stderr && !stderr.includes('warning')) {
      console.error('Error generating MOS content:', stderr);
      return { 
        success: false, 
        message: 'Failed to generate MOS content. See server logs for details.' 
      };
    }

    // Reload contentlayer to refresh the generated content
    await execAsync('pnpm contentlayer2 build');
    
    return { 
      success: true, 
      message: 'MOS content generated successfully!' 
    };
  } catch (error) {
    console.error('Error in generateMosContent:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

export async function checkMosContentExists() {
  try {
    // Check if we're in production environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, assume content exists if activities are defined
      // This is a fallback for environments where we can't check the filesystem
      return { 
        exists: Object.keys(activities).length > 0, 
        count: Object.keys(activities).length 
      };
    }
    
    // In development, check the filesystem
    const mosDir = path.join(process.cwd(), 'content', 'mos');
    if (!fs.existsSync(mosDir)) {
      return { exists: false, count: 0 };
    }

    // Count number of mdx files recursively
    let count = 0;
    
    // Simple recursive function to count MDX files
    const countMdxFiles = (dir: string) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          countMdxFiles(fullPath);
        } else if (file.endsWith('.mdx')) {
          count++;
        }
      }
    };
    
    countMdxFiles(mosDir);
    
    return { exists: true, count };
  } catch (error) {
    console.error('Error checking MOS content:', error);
    // If we can't check, assume no content exists (to trigger generation)
    return { exists: false, count: 0 };
  }
} 