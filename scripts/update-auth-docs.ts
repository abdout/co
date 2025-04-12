import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// File paths
const AUTH_MDC_PATH = '.cursor/rules/auth.mdc';
const README_PATH = 'src/components/auth/README.md';
const ISSUE_PATH = 'src/components/auth/ISSUE.md';

// Get last commit date of a file
function getLastModifiedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting last modified date for ${filePath}:`, error);
    return new Date(0); // Return epoch if file doesn't exist
  }
}

// Check if any auth files have been modified since the last documentation update
function hasAuthChanges(): boolean {
  const lastReadmeUpdate = getLastModifiedDate(README_PATH);
  const lastIssueMdUpdate = getLastModifiedDate(ISSUE_PATH);
  const lastAuthMdcUpdate = getLastModifiedDate(AUTH_MDC_PATH);

  // Get the oldest documentation update time
  const oldestDocUpdate = new Date(Math.min(
    lastReadmeUpdate.getTime(),
    lastIssueMdcUpdate.getTime(),
    lastAuthMdcUpdate.getTime()
  ));

  // Auth related directories to check for changes
  const authDirectories = [
    'auth.ts',
    'auth.config.ts',
    'middleware.ts',
    'routes.ts',
    'next-auth.d.ts',
    'src/app/(auth)',
    'src/app/api/auth',
    'src/components/auth',
    'src/lib/auth.ts',
    'src/lib/mail.ts',
    'src/lib/tokens.ts',
  ];

  // Check if any auth files were modified after the last doc update
  for (const dir of authDirectories) {
    try {
      if (fs.existsSync(dir)) {
        if (fs.statSync(dir).isDirectory()) {
          // If it's a directory, check all files recursively
          const files = getAllFiles(dir);
          for (const file of files) {
            const fileModTime = getLastModifiedDate(file);
            if (fileModTime > oldestDocUpdate) {
              console.log(`File changed: ${file}`);
              return true;
            }
          }
        } else {
          // It's a file, check its modification time
          const fileModTime = getLastModifiedDate(dir);
          if (fileModTime > oldestDocUpdate) {
            console.log(`File changed: ${dir}`);
            return true;
          }
        }
      }
    } catch (error) {
      console.error(`Error checking ${dir}:`, error);
    }
  }

  return false;
}

// Recursively get all files in a directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

// Get all providers from auth.config.ts
function getAuthProviders(): string[] {
  try {
    const authConfigContent = fs.readFileSync('auth.config.ts', 'utf8');
    const providers: string[] = [];
    
    // Simple regex to extract provider names
    const providerRegex = /import\s+(\w+)\s+from\s+["']next-auth\/providers\/(\w+)["']/g;
    let match;
    
    while ((match = providerRegex.exec(authConfigContent)) !== null) {
      providers.push(match[2]);
    }
    
    return providers;
  } catch (error) {
    console.error('Error reading auth.config.ts:', error);
    return [];
  }
}

// Update README.md with latest auth information
function updateReadme(): void {
  try {
    const providers = getAuthProviders();
    const providersText = providers.join(', ');
    
    // Get current content
    let readmeContent = fs.existsSync(README_PATH) 
      ? fs.readFileSync(README_PATH, 'utf8')
      : '# Authentication Module\n\n';
    
    // Update the providers section
    const providersSection = `## Features\n- Multi-provider authentication (${providersText})\n- JWT-based authentication with session management\n- User role-based access control\n- Two-factor authentication\n- Email verification flow\n- Password reset functionality\n- Automatic redirection for protected routes\n`;
    
    // Simple replacement - in a real implementation you'd want more sophisticated parsing
    if (readmeContent.includes('## Features')) {
      readmeContent = readmeContent.replace(/## Features[\s\S]*?(?=\n##|$)/, providersSection);
    } else {
      readmeContent += `\n${providersSection}`;
    }
    
    // Update last modified timestamp
    const timestamp = new Date().toISOString();
    const lastUpdatedSection = `\n\n## Last Updated\n${timestamp}\n`;
    
    if (readmeContent.includes('## Last Updated')) {
      readmeContent = readmeContent.replace(/## Last Updated[\s\S]*?(?=\n##|$)/, lastUpdatedSection);
    } else {
      readmeContent += lastUpdatedSection;
    }
    
    // Write updated content
    fs.writeFileSync(README_PATH, readmeContent);
    console.log('Updated README.md');
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

// Update ISSUE.md with latest status
function updateIssueFile(): void {
  try {
    // Get current content or create new if doesn't exist
    let issueContent = fs.existsSync(ISSUE_PATH)
      ? fs.readFileSync(ISSUE_PATH, 'utf8')
      : '# Authentication Issues Tracker\n\n## Current Issues\n\n';
    
    // Get the latest git log for auth files to find recent changes
    try {
      const gitLog = execSync('git log -n 5 --pretty=format:"%s" -- auth.ts auth.config.ts src/components/auth').toString();
      const recentChanges = gitLog.split('\n').filter(l => l.trim().length > 0);
      
      // Create or update the recent changes section
      const changesSection = `## Recent Changes\n${recentChanges.map(c => `- ${c}`).join('\n')}\n`;
      
      if (issueContent.includes('## Recent Changes')) {
        issueContent = issueContent.replace(/## Recent Changes[\s\S]*?(?=\n##|$)/, changesSection);
      } else {
        // Add after current issues
        issueContent = issueContent.replace(/(?=\n##|$)/, `\n\n${changesSection}`);
      }
    } catch (error) {
      console.log('Could not get git history, skipping recent changes section');
    }
    
    // Update last updated timestamp
    const timestamp = new Date().toISOString();
    const lastUpdatedSection = `\n\n## Last Updated\n${timestamp}\n`;
    
    if (issueContent.includes('## Last Updated')) {
      issueContent = issueContent.replace(/## Last Updated[\s\S]*?(?=\n##|$)/, lastUpdatedSection);
    } else {
      issueContent += lastUpdatedSection;
    }
    
    // Write updated content
    fs.writeFileSync(ISSUE_PATH, issueContent);
    console.log('Updated ISSUE.md');
  } catch (error) {
    console.error('Error updating ISSUE.md:', error);
  }
}

// Update auth.mdc with latest auth information
function updateAuthMdc(): void {
  try {
    // Get current content
    const authMdcContent = fs.readFileSync(AUTH_MDC_PATH, 'utf8');
    
    // In a real implementation, you would parse the content and update specific sections
    // For now, we'll just append the last update timestamp
    
    const lines = authMdcContent.split('\n');
    let updatedContent = '';
    let foundTimestamp = false;
    
    for (const line of lines) {
      if (line.startsWith('## Last Updated')) {
        updatedContent += `## Last Updated\n${new Date().toISOString()}\n`;
        foundTimestamp = true;
      } else {
        updatedContent += line + '\n';
      }
    }
    
    if (!foundTimestamp) {
      updatedContent += `\n## Last Updated\n${new Date().toISOString()}\n`;
    }
    
    fs.writeFileSync(AUTH_MDC_PATH, updatedContent);
    console.log('Updated auth.mdc');
  } catch (error) {
    console.error('Error updating auth.mdc:', error);
  }
}

// Main function
function main(): void {
  console.log('Checking for auth changes...');
  
  if (process.argv.includes('--force') || hasAuthChanges()) {
    console.log('Auth changes detected, updating documentation...');
    updateReadme();
    updateIssueFile();
    updateAuthMdc();
    console.log('Documentation updated successfully.');
  } else {
    console.log('No auth changes detected, skipping documentation update.');
  }
}

// Run the main function
main(); 