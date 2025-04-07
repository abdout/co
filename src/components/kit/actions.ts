'use server';

import { revalidatePath } from 'next/cache';
import { createKitInDb, findKits, findKitById, updateKitInDb, deleteKitFromDb } from './model';
import { KitFormValues } from './validation';
import { auth } from '../../../auth';
import { Kit as KitType } from './types';

export async function createKit(data: KitFormValues) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    const kit = await createKitInDb(data);
    
    revalidatePath('/resource/kit');
    
    return { success: true, data: kit };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to create kit'
    };
  }
}

export async function getKits() {
  try {
    const kits = await findKits();
    
    // Return just the array of kits
    return kits;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch kits');
  }
}

export async function getKit(id: string) {
  try {
    const kit = await findKitById(id);
    
    if (!kit) {
      return { success: false, message: 'Kit not found' };
    }
    
    return { success: true, data: kit };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch kit'
    };
  }
}

export async function updateKit(id: string, data: Partial<KitFormValues>) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    const kit = await updateKitInDb(id, data);
    
    if (!kit) {
      return { success: false, message: 'Kit not found' };
    }
    
    revalidatePath('/resource/kit');
    
    return { success: true, data: kit };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to update kit'
    };
  }
}

export async function deleteKit(id: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    await deleteKitFromDb(id);
    
    revalidatePath('/resource/kit');
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to delete kit'
    };
  }
} 