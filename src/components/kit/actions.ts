'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Kit from './model';
import { KitFormValues } from './validation';
import { auth } from '../../../auth';
import { Kit as KitType } from './types';

// Helper function to serialize MongoDB documents
const serializeDocument = (doc: any): any => {
  if (!doc) return doc;
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(item => serializeDocument(item));
  }
  
  // Handle objects
  if (typeof doc === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(doc)) {
      // Handle ObjectId
      if (key === '_id' && value?.toString) {
        serialized[key] = value.toString();
      }
      // Handle Date objects
      else if (value instanceof Date) {
        serialized[key] = value.toISOString();
      }
      // Handle nested objects
      else if (typeof value === 'object' && value !== null) {
        serialized[key] = serializeDocument(value);
      }
      // Handle primitive values
      else {
        serialized[key] = value;
      }
    }
    return serialized;
  }
  
  return doc;
};

export async function createKit(data: KitFormValues) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    await connectDB();
    
    const kit = await Kit.create({
      id: data.id,
      name: data.name,
      src: data.src,
      alt: data.alt,
      width: data.width,
      bg: data.bg,
      calibration: data.calibration,
      datasheet: data.datasheet,
      manual: data.manual,
      status: data.status,
      under: data.under,
      location: data.location,
      price: data.price,
    });

    revalidatePath('/resource/kit');
    
    // Serialize the kit before returning
    const serializedKit = serializeDocument(kit.toObject ? kit.toObject() : kit);
    
    return { success: true, data: serializedKit };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to create kit'
    };
  }
}

export async function getKits() {
  try {
    await connectDB();
    
    const kits = await Kit.find({}).sort({ createdAt: -1 });
    
    // Serialize the kits before returning
    const serializedKits = serializeDocument(
      kits.map(kit => kit.toObject ? kit.toObject() : kit)
    );
    
    // Return just the array of kits without the success wrapper
    return serializedKits;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch kits');
  }
}

export async function getKit(id: string) {
  try {
    await connectDB();
    
    const kit = await Kit.findOne({ id });
    if (!kit) {
      return { success: false, message: 'Kit not found' };
    }
    
    // Serialize the kit before returning
    const serializedKit = serializeDocument(kit.toObject ? kit.toObject() : kit);
    
    return { success: true, data: serializedKit };
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
    
    await connectDB();
    
    const kit = await Kit.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true }
    );
    
    if (!kit) {
      return { success: false, message: 'Kit not found' };
    }
    
    revalidatePath('/resource/kit');
    
    // Serialize the kit before returning
    const serializedKit = serializeDocument(kit.toObject ? kit.toObject() : kit);
    
    return { success: true, data: serializedKit };
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
    
    await connectDB();
    
    const kit = await Kit.findOneAndDelete({ id });
    
    if (!kit) {
      return { success: false, message: 'Kit not found' };
    }
    
    revalidatePath('/resource/kit');
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to delete kit'
    };
  }
} 