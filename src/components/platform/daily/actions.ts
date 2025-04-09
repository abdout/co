'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { auth } from '../../../../auth';
import { DailyFormValues } from './validation';
import { Daily } from './type';
import { DAILY_STATUS, DAILY_PRIORITY } from './constant';

export async function createDaily(data: Partial<DailyFormValues>) {
  console.log('=== Server Action: createDaily ===');
  console.log('Received data:', JSON.stringify(data, null, 2));

  try {
    // Check authentication
    const session = await auth();
    console.log('Auth session:', session ? 'Valid' : 'Invalid');
    
    if (!session?.user) {
      console.log('User not authenticated for create daily');
      return { error: 'Not authenticated' };
    }
    
    console.log('Authenticated user:', session.user.email);
    
    // Create a clean object but don't provide defaults for optional fields
    // For backward compatibility, use either task or title field
    const taskValue = data.task || (data as any).title;
    
    const cleanData = {
      task: taskValue,
      title: taskValue, // Keep title for backward compatibility
      description: data.description,
      date: data.date,
      engineer: data.engineer,
      project: data.project,
      status: data.status,
      priority: data.priority,
      hoursSpent: data.hoursSpent,
      completionPercentage: data.completionPercentage,
      blockers: data.blockers,
      plannedTomorrow: data.plannedTomorrow,
    };
    
    console.log('Sanitized data for daily creation:', JSON.stringify(cleanData, null, 2));
    
    // Create new daily with Prisma
    const daily = await db.daily.create({
      data: cleanData
    });
    
    console.log('Daily saved to database with ID:', daily.id);
    
    revalidatePath('/daily');
    console.log('Revalidated path: /daily');
    
    return { success: true, dailyId: daily.id };
  } catch (error: any) {
    console.error('Error creating daily:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to create daily' };
  }
}

export async function getDailies() {
  console.log('=== Server Action: getDailies ===');
  try {
    console.log('Fetching dailies with Prisma');
    
    const dailies = await db.daily.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Fetched ${dailies.length} dailies from database`);
    
    // Map Prisma results to match the expected structure in frontend
    const simplifiedDailies = dailies.map(daily => {
      // For backward compatibility - handle both title and task fields
      const taskValue = daily.task || (daily as any).title || '';
      
      return {
        _id: daily.id,
        id: daily.id,
        task: taskValue,
        title: taskValue, // Keep title for backward compatibility
        description: daily.description || '',
        date: daily.date || '',
        engineer: daily.engineer || '',
        project: daily.project || '',
        status: daily.status || '',
        priority: daily.priority || '',
        hoursSpent: daily.hoursSpent || '',
        completionPercentage: daily.completionPercentage || '',
        blockers: daily.blockers || '',
        plannedTomorrow: daily.plannedTomorrow || '',
        createdAt: daily.createdAt,
        updatedAt: daily.updatedAt
      };
    });
    
    return { success: true, dailies: simplifiedDailies };
  } catch (error: any) {
    console.error('Error fetching dailies:', error);
    return { error: error.message || 'Failed to fetch dailies' };
  }
}

export async function getDaily(id: string) {
  try {
    console.log('Fetching daily with Prisma ID:', id);
    
    const daily = await db.daily.findUnique({
      where: { id }
    });
    
    if (!daily) {
      return { error: 'Daily not found' };
    }
    
    // Map Prisma result to match the expected structure in frontend
    // For backward compatibility - handle both title and task fields
    const taskValue = daily.task || (daily as any).title || '';
    
    const simplifiedDaily = {
      _id: daily.id,
      id: daily.id,
      task: taskValue,
      title: taskValue, // Keep title for backward compatibility
      description: daily.description || '',
      date: daily.date || '',
      engineer: daily.engineer || '',
      project: daily.project || '',
      status: daily.status || '',
      priority: daily.priority || '',
      hoursSpent: daily.hoursSpent || '',
      completionPercentage: daily.completionPercentage || '',
      blockers: daily.blockers || '',
      plannedTomorrow: daily.plannedTomorrow || '',
      createdAt: daily.createdAt,
      updatedAt: daily.updatedAt
    };
    
    return { success: true, daily: simplifiedDaily };
  } catch (error: any) {
    console.error('Error fetching daily:', error);
    return { error: error.message || 'Failed to fetch daily' };
  }
}

export async function updateDaily(id: string, data: Partial<DailyFormValues>) {
  console.log('=== Server Action: updateDaily ===');
  console.log('Updating daily ID:', id);
  console.log('Update data:', JSON.stringify(data, null, 2));
  
  try {
    // Check authentication
    const session = await auth();
    console.log('Auth session:', session ? 'Valid' : 'Invalid');
    
    if (!session?.user) {
      console.log('User not authenticated for update daily');
      return { error: 'Not authenticated' };
    }
    
    console.log('Authenticated user:', session.user.email);
    
    // Only update fields that were provided
    const updateData: any = {};
    
    // For backward compatibility, update both task and title fields if either is provided
    if (data.task !== undefined || (data as any).title !== undefined) {
      const taskValue = data.task || (data as any).title;
      updateData.task = taskValue;
      updateData.title = taskValue; // Keep title for backward compatibility
    }
    
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.engineer !== undefined) updateData.engineer = data.engineer;
    if (data.project !== undefined) updateData.project = data.project;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.hoursSpent !== undefined) updateData.hoursSpent = data.hoursSpent;
    if (data.completionPercentage !== undefined) updateData.completionPercentage = data.completionPercentage;
    if (data.blockers !== undefined) updateData.blockers = data.blockers;
    if (data.plannedTomorrow !== undefined) updateData.plannedTomorrow = data.plannedTomorrow;
    
    console.log('Update data for Prisma:', JSON.stringify(updateData, null, 2));
    
    const daily = await db.daily.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath('/daily');
    console.log('Revalidated path: /daily');
    
    return { success: true, daily };
  } catch (error: any) {
    console.error('Error updating daily:', error);
    return { error: error.message || 'Failed to update daily' };
  }
}

export async function deleteDaily(id: string) {
  console.log('=== Server Action: deleteDaily ===');
  console.log('Deleting daily ID:', id);
  
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }
    
    await db.daily.delete({
      where: { id },
    });
    
    revalidatePath('/daily');
    console.log('Daily deleted and path revalidated');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting daily:', error);
    return { error: error.message || 'Failed to delete daily' };
  }
}

// Function to sync tasks with dailies
export async function syncTasksWithDailies() {
  console.log('=== Server Action: syncTasksWithDailies ===');
  
  try {
    // Get all tasks from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentTasks = await db.task.findMany({
      where: {
        updatedAt: {
          gte: yesterday
        }
      }
    });
    
    console.log(`Found ${recentTasks.length} recent tasks to sync with dailies`);
    
    // Create individual daily reports for each task
    const results = await Promise.all(
      recentTasks.map(async (task) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if we already have a daily for this specific task today
        const existingDaily = await db.daily.findFirst({
          where: {
            task: task.task,
            project: task.project,
            date: today
          }
        });
        
        if (existingDaily) {
          console.log(`Daily already exists for task "${task.task}" in project ${task.project} on ${today}`);
          
          // Update the existing daily with latest task info
          await db.daily.update({
            where: { id: existingDaily.id },
            data: {
              status: task.status.toString(),
              priority: task.priority.toString(),
              hoursSpent: task.hours?.toString() || "0",
              blockers: task.status === 'stuck' ? task.desc || '' : '',
              completionPercentage: task.status === 'done' ? '100' : 
                                   task.status === 'in_progress' ? '50' : 
                                   task.status === 'stuck' ? '25' : '0'
            }
          });
          
          return { task: task.task, project: task.project, status: 'updated', dailyId: existingDaily.id };
        }
        
        // Map task status to daily status
        let dailyStatus;
        switch(task.status) {
          case 'done':
            dailyStatus = DAILY_STATUS.COMPLETED;
            break;
          case 'stuck':
            dailyStatus = DAILY_STATUS.STUCK;
            break;
          case 'in_progress':
            dailyStatus = DAILY_STATUS.IN_PROGRESS;
            break;
          default:
            dailyStatus = DAILY_STATUS.PENDING;
        }
        
        // Map task priority to daily priority
        let dailyPriority;
        switch(task.priority) {
          case 'high':
            dailyPriority = DAILY_PRIORITY.HIGH;
            break;
          case 'medium':
            dailyPriority = DAILY_PRIORITY.MEDIUM;
            break;
          case 'low':
            dailyPriority = DAILY_PRIORITY.LOW;
            break;
          default:
            dailyPriority = DAILY_PRIORITY.PENDING;
        }
        
        // Create a new daily report for this task
        const daily = await db.daily.create({
          data: {
            task: task.task,
            description: task.desc || '',
            date: today,
            engineer: task.assignedTo?.[0] || 'Team',
            project: task.project,
            status: dailyStatus,
            priority: dailyPriority,
            hoursSpent: task.hours?.toString() || "0",
            completionPercentage: task.status === 'done' ? '100' : 
                                 task.status === 'in_progress' ? '50' : 
                                 task.status === 'stuck' ? '25' : '0',
            blockers: task.status === 'stuck' ? (task.desc || '') : '',
            plannedTomorrow: task.status !== 'done' ? (task.task || '') : ''
          }
        });
        
        console.log(`Created daily for task "${task.task}" in project ${task.project} with ID ${daily.id}`);
        return { task: task.task, project: task.project, status: 'created', dailyId: daily.id };
      })
    );
    
    revalidatePath('/daily');
    return { success: true, results };
  } catch (error: any) {
    console.error('Error syncing tasks with dailies:', error);
    return { error: error.message || 'Failed to sync tasks with dailies' };
  }
} 