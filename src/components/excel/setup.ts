'use server';

import { db } from '@/lib/db';
import { updateExcelBackup } from './actions';

let isInitialized = false;

/**
 * Setup Prisma middleware to automatically update the Excel file
 * when user data changes
 */
export async function initializeExcelBackups() {
  // Only initialize once
  if (isInitialized) return;
  
  // Set up Prisma middleware
  db.$use(async (params, next) => {
    const result = await next(params);
    
    // Only trigger on User model changes
    if (params.model === 'User' && 
        ['create', 'update', 'delete'].includes(params.action)) {
      // Update Excel backup asynchronously
      updateExcelBackup().catch(console.error);
    }
    
    return result;
  });
  
  console.log('[Excel Backup] Automatic Excel backup system initialized');
  isInitialized = true;
  
  // Generate initial backup
  try {
    await updateExcelBackup();
    console.log('[Excel Backup] Initial backup created successfully');
  } catch (error) {
    console.error('[Excel Backup] Failed to create initial backup:', error);
  }
  
  return true;
} 