import { db } from '@/lib/db';
import { ExcelService } from './excel-service';

export function setupMembershipTriggers() {
  const excel = ExcelService.getInstance();
  
  // Set up Prisma middleware
  db.$use(async (params, next) => {
    const result = await next(params);
    
    // Only trigger on User model changes
    if (params.model === 'User' && 
        ['create', 'update', 'delete'].includes(params.action)) {
      // Update Excel backup
      excel.updateBackup().catch(console.error);
    }
    
    return result;
  });
  
  console.log('Membership Excel backup triggers initialized');
  return true;
} 