'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Car from './model';
import { CarFormValues } from './validation';
import { auth } from '../../../auth';
import { Car as CarType } from './types';

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

export async function createCar(data: CarFormValues) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    await connectDB();
    
    const car = await Car.create({
      id: data.id,
      name: data.name,
      src: data.src,
      alt: data.alt,
      sim: data.sim,
      petrol: data.petrol,
      oil: data.oil,
      history: data.history,
      status: data.status,
      under: data.under,
      km: data.km,
      width: data.width,
      licence: data.licence,
      penalty: data.penalty,
    });

    revalidatePath('/resource/car');
    
    // Serialize the car before returning
    const serializedCar = serializeDocument(car.toObject ? car.toObject() : car);
    
    return { success: true, data: serializedCar };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to create car'
    };
  }
}

export async function getCars() {
  try {
    await connectDB();
    
    const cars = await Car.find({}).sort({ createdAt: -1 });
    
    // Serialize the cars before returning
    const serializedCars = serializeDocument(
      cars.map(car => car.toObject ? car.toObject() : car)
    );
    
    return { success: true, data: serializedCars };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch cars'
    };
  }
}

export async function getCar(id: string) {
  try {
    await connectDB();
    
    const car = await Car.findOne({ id });
    if (!car) {
      return { success: false, message: 'Car not found' };
    }
    
    // Serialize the car before returning
    const serializedCar = serializeDocument(car.toObject ? car.toObject() : car);
    
    return { success: true, data: serializedCar };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch car'
    };
  }
}

export async function updateCar(id: string, data: Partial<CarFormValues>) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    await connectDB();
    
    const car = await Car.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true }
    );
    
    if (!car) {
      return { success: false, message: 'Car not found' };
    }
    
    revalidatePath('/resource/car');
    
    // Serialize the car before returning
    const serializedCar = serializeDocument(car.toObject ? car.toObject() : car);
    
    return { success: true, data: serializedCar };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to update car'
    };
  }
}

export async function deleteCar(id: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    await connectDB();
    
    const car = await Car.findOneAndDelete({ id });
    
    if (!car) {
      return { success: false, message: 'Car not found' };
    }
    
    revalidatePath('/resource/car');
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to delete car'
    };
  }
} 