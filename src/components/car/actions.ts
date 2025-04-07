'use server';

import { revalidatePath } from 'next/cache';
import { createCarInDb, findCars, findCarById, updateCarInDb, deleteCarFromDb } from './model';
import { CarFormValues } from './validation';
import { auth } from '../../../auth';
import { Car as CarType } from './types';

export async function createCar(data: CarFormValues) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: 'Authentication required' };
    }
    
    const car = await createCarInDb(data);
    
    revalidatePath('/resource/car');
    
    return { success: true, data: car };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to create car'
    };
  }
}

export async function getCars() {
  try {
    const cars = await findCars();
    
    // Return just the array of cars
    return cars;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch cars');
  }
}

export async function getCar(id: string) {
  try {
    const car = await findCarById(id);
    
    if (!car) {
      return { success: false, message: 'Car not found' };
    }
    
    return { success: true, data: car };
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
    
    const car = await updateCarInDb(id, data);
    
    if (!car) {
      return { success: false, message: 'Car not found' };
    }
    
    revalidatePath('/resource/car');
    
    return { success: true, data: car };
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
    
    await deleteCarFromDb(id);
    
    revalidatePath('/resource/car');
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to delete car'
    };
  }
} 