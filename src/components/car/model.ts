'use server';

import { db } from "@/lib/db";
import { type CarFormValues } from "./validation";

// Helper functions for common Car operations

/**
 * Create a new Car
 */
export async function createCarInDb(data: CarFormValues) {
  try {
    const car = await db.car.create({
      data: {
        id: data.id || undefined,
        name: data.name,
        images: data.images || [],
        sim: data.sim,
        petrol: data.petrol,
        oil: data.oil,
        history: data.history,
        status: data.status,
        under: data.under,
        km: data.km,
        licence: data.licence,
        penalty: data.penalty,
      }
    });
    
    return car;
  } catch (error: any) {
    console.error('Error creating car:', error);
    throw new Error(error.message || 'Failed to create car');
  }
}

/**
 * Find all Cars with optional filtering
 */
export async function findCars() {
  try {
    const cars = await db.car.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return cars;
  } catch (error: any) {
    console.error('Error finding cars:', error);
    throw new Error(error.message || 'Failed to find cars');
  }
}

/**
 * Find a Car by ID
 */
export async function findCarById(id: string) {
  try {
    if (!id) {
      throw new Error('Car ID is required');
    }
    
    const car = await db.car.findUnique({
      where: { id }
    });
    
    return car;
  } catch (error: any) {
    console.error(`Error finding car with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to find car');
  }
}

/**
 * Update a Car
 */
export async function updateCarInDb(id: string, data: Partial<CarFormValues>) {
  try {
    if (!id) {
      throw new Error('Car ID is required');
    }
    
    const car = await db.car.update({
      where: { id },
      data: {
        name: data.name,
        images: data.images,
        sim: data.sim,
        petrol: data.petrol,
        oil: data.oil,
        history: data.history,
        status: data.status,
        under: data.under,
        km: data.km,
        licence: data.licence,
        penalty: data.penalty,
      }
    });
    
    return car;
  } catch (error: any) {
    console.error(`Error updating car with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to update car');
  }
}

/**
 * Delete a Car
 */
export async function deleteCarFromDb(id: string) {
  try {
    if (!id) {
      throw new Error('Car ID is required');
    }
    
    await db.car.delete({
      where: { id }
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting car with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to delete car');
  }
} 