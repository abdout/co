import { db } from "@/lib/db";
import { type KitFormValues } from "./validation";

// Export the Prisma client for direct DB access when needed
export { db };

// Helper functions for common Kit operations

/**
 * Create a new Kit
 */
export async function createKitInDb(data: KitFormValues) {
  return db.kit.create({
    data: {
      id: data.id || undefined,
      name: data.name || undefined,
      picture: data.picture || undefined,
      images: data.images || undefined,
      accessories: data.accessories || undefined,
      calibration: data.calibration || undefined,
      calibrationIssue: data.calibrationIssue || undefined,
      calibrationDue: data.calibrationDue ? new Date(data.calibrationDue) : undefined,
      software: data.software || undefined,
      datasheet: data.datasheet || undefined,
      manual: data.manual || undefined,
      status: data.status || undefined,
      under: data.under || undefined,
      location: data.location || undefined,
      price: data.price || undefined,
    },
  });
}

/**
 * Find all Kits with optional filtering
 */
export async function findKits(options: { 
  orderBy?: 'createdAt' | 'name'; 
  orderDir?: 'asc' | 'desc';
  status?: string; 
  take?: number;
} = {}) {
  const { 
    orderBy = 'createdAt', 
    orderDir = 'desc',
    status,
    take
  } = options;
  
  return db.kit.findMany({
    where: status ? { status } : undefined,
    orderBy: { [orderBy]: orderDir },
    take: take || undefined,
  });
}

/**
 * Find a Kit by ID
 */
export async function findKitById(id: string) {
  return db.kit.findUnique({
    where: { id },
  });
}

/**
 * Update a Kit
 */
export async function updateKitInDb(id: string, data: Partial<KitFormValues>) {
  const updateData = {
    ...data,
    calibrationDue: data.calibrationDue ? new Date(data.calibrationDue) : undefined,
  };
  
  return db.kit.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete a Kit
 */
export async function deleteKitFromDb(id: string) {
  return db.kit.delete({
    where: { id },
  });
} 