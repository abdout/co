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

// Helper to normalize strings for matching files
export async function normalizeForFile(str: string): Promise<string> {
  return str.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[\.\/\\]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .trim();
};

// Load MDX content for a specific system/category combination
export async function loadMdxContent(system: string, category: string) {
  try {
    const normalizedSystem = await normalizeForFile(system);
    const normalizedCategory = await normalizeForFile(category);
    
    // First, try to locate the MDX file in the content directory
    try {
      const filePath = path.join(process.cwd(), 'content', 'mos', normalizedSystem, `${normalizedCategory}.mdx`);
      
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        console.log(`Found MDX file: ${filePath}`);
        
        // Read the file content (don't try to parse it here though)
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the .contentlayer directory exists
        const contentlayerDir = path.join(process.cwd(), '.contentlayer');
        if (!fs.existsSync(contentlayerDir)) {
          console.log('.contentlayer directory not found, need to build contentlayer');
          
          // Build contentlayer to generate the needed files
          try {
            await execAsync('pnpm contentlayer build');
            console.log('Successfully built contentlayer content');
          } catch (buildErr) {
            console.error('Error building contentlayer content:', buildErr);
          }
        }
        
        // Now we'll return a simple object with the metadata but not the compiled code
        // The UI will use fallback rendering for this case
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
        
        // Parse the frontmatter as YAML-like format
        const frontmatterObj: Record<string, string> = {};
        frontmatter.split('\n').forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim().replace(/^"(.*)"$/, '$1');
            frontmatterObj[key] = value;
          }
        });
        
        // Extract the body (everything after frontmatter)
        const body = content.replace(/---\n[\s\S]*?\n---/, '').trim();
        
        // Create a ContentActivity-like object that the UI can use
        const contentActivity = {
          _id: `${normalizedSystem}/${normalizedCategory}`,
          title: frontmatterObj.title || category,
          system: frontmatterObj.system || system,
          category: frontmatterObj.category || category,
          description: frontmatterObj.description || `Maintenance activities for ${category} in ${system} system`,
          body: {
            raw: body,
            // No compiled code - the UI will need to handle this case
            code: null 
          },
          slug: `${normalizedSystem}/${normalizedCategory}`,
          url: `/mos/${normalizedSystem}/${normalizedCategory}`
        };
        
        return {
          success: true,
          content: contentActivity
        };
      }
    } catch (err) {
      console.error(`Error reading MDX file for ${normalizedSystem}/${normalizedCategory}:`, err);
    }
    
    // If direct reading fails, try to find the content by listing the directory
    try {
      const systemDir = path.join(process.cwd(), 'content', 'mos', normalizedSystem);
      
      if (fs.existsSync(systemDir)) {
        console.log(`Looking for a matching file in ${systemDir}`);
        const files = fs.readdirSync(systemDir);
        
        // Look for a file that might match our category
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const fileCategory = file.replace('.mdx', '');
            if (fileCategory === normalizedCategory) {
              // We found an exact match
              console.log(`Found matching file: ${file}`);
              
              // Now try to read it again
              return await loadMdxContent(system, category);
            }
          }
        }
        
        console.log(`No matching file found in ${systemDir}, available files:`, files);
      } else {
        console.log(`System directory does not exist: ${systemDir}`);
      }
    } catch (err) {
      console.error(`Error listing directory for ${normalizedSystem}:`, err);
    }
    
    // If all else fails, return not found
    return {
      success: false,
      message: `No content found for ${system}/${category}`
    };
  } catch (error) {
    console.error('Error loading MDX content:', error);
    return {
      success: false,
      message: 'Failed to load content'
    };
  }
} 