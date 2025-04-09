'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

import { TaskFormValues } from './validation';
import { auth } from '../../../../auth';
import { Task as TaskType, Activity } from './type';
import { TASK_STATUS, TASK_PRIORITY } from './constant';
import { TaskStatus, TaskPriority } from '@prisma/client';

export async function createTask(data: TaskFormValues) {
  console.log('=== Server Action: createTask ===');
  console.log('Raw data received:', {
    status: data.status,
    priority: data.priority,
    statusType: typeof data.status,
    priorityType: typeof data.priority
  });
  console.log('Expected values:', {
    statusEnum: [TASK_STATUS.PENDING, TASK_STATUS.STUCK, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE],
    priorityEnum: [TASK_PRIORITY.PENDING, TASK_PRIORITY.HIGH, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.LOW]
  });
  
  try {
    // Check authentication
    const session = await auth();
    console.log('Auth session:', session ? 'Valid' : 'Invalid');
    
    if (!session?.user) {
      console.log('User not authenticated for create task');
      return { error: 'Not authenticated' };
    }
    
    console.log('Authenticated user:', session.user.email);
    console.log('Creating task with Prisma');
    
    // Map string values to Prisma enums
    const statusValue = mapStatusToPrismaEnum(data.status);
    const priorityValue = mapPriorityToPrismaEnum(data.priority);
    
    // Create a clean object to prevent circular references
    const cleanData = {
      project: data.project || '',
      task: data.task || '',
      status: statusValue,
      priority: priorityValue,
      duration: data.duration || '',
      desc: data.desc || '',
      tag: data.tag || '',
      remark: data.remark || '',
      date: data.date,
      hours: data.hours,
      overtime: data.overtime,
      assignedTo: data.assignedTo ? [...data.assignedTo] : []
    };
    
    // Log the sanitized data
    console.log('Sanitized data for task creation:', JSON.stringify(cleanData, null, 2));
    
    // Create new task with Prisma
    const savedTask = await db.task.create({
      data: {
        project: cleanData.project,
        task: cleanData.task,
        club: '',
        status: cleanData.status,
        priority: cleanData.priority,
        duration: cleanData.duration,
        desc: cleanData.desc,
        tag: cleanData.tag,
        remark: cleanData.remark,
        date: cleanData.date,
        hours: cleanData.hours,
        overtime: cleanData.overtime,
        assignedTo: cleanData.assignedTo
      }
    });
    
    console.log('Task saved to database with ID:', savedTask.id);
    
    revalidatePath('/task');
    console.log('Revalidated path: /task');
    
    return { success: true, taskId: savedTask.id };
  } catch (error: any) {
    console.error('Error creating task:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to create task' };
  }
}

export async function getTasks() {
  console.log('=== Server Action: getTasks ===');
  try {
    console.log('Fetching tasks with Prisma');
    
    const tasks = await db.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Fetched ${tasks.length} tasks from database`);
    
    // Map Prisma results to match the expected structure in frontend
    const simplifiedTasks = tasks.map(task => {
      return {
        _id: task.id,
        id: task.id,
        project: task.project || '',
        task: task.task || '',
        status: task.status as unknown as string,
        priority: task.priority as unknown as string,
        duration: task.duration || '',
        desc: task.desc || '',
        club: task.club || '',
        tag: task.tag || '',
        remark: task.remark || '',
        label: task.label || '',
        date: task.date,
        hours: task.hours || 0,
        overtime: task.overtime || 0,
        assignedTo: task.assignedTo || [],
        linkedActivity: task.linkedActivity,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };
    });
    
    return { success: true, tasks: simplifiedTasks };
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return { error: error.message || 'Failed to fetch tasks' };
  }
}

export async function getTask(id: string) {
  try {
    console.log('Fetching task with Prisma ID:', id);
    
    const task = await db.task.findUnique({
      where: { id }
    });
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    // Map Prisma result to match the expected structure in frontend
    const simplifiedTask = {
      _id: task.id,
      id: task.id,
      project: task.project || '',
      task: task.task || '',
      status: task.status as unknown as string,
      priority: task.priority as unknown as string,
      duration: task.duration || '',
      desc: task.desc || '',
      club: task.club || '',
      tag: task.tag || '',
      remark: task.remark || '',
      label: task.label || '',
      date: task.date,
      hours: task.hours || 0,
      overtime: task.overtime || 0,
      assignedTo: task.assignedTo || [],
      linkedActivity: task.linkedActivity,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
    
    return { success: true, task: simplifiedTask };
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return { error: error.message || 'Failed to fetch task' };
  }
}

export async function updateTask(id: string, data: Partial<TaskFormValues>) {
  console.log('=== Server Action: updateTask ===');
  console.log('Updating task ID:', id);
  console.log('Update data:', JSON.stringify(data, null, 2));
  
  try {
    // Check authentication
    const session = await auth();
    console.log('Auth session:', session ? 'Valid' : 'Invalid');
    
    if (!session?.user) {
      console.log('User not authenticated for update task');
      return { error: 'Not authenticated' };
    }
    
    console.log('Authenticated user:', session.user.email);
    console.log('Updating task with Prisma');
    
    // Check if task exists before update
    const existingTask = await db.task.findUnique({
      where: { id }
    });
    
    if (!existingTask) {
      console.log('Task not found for update:', id);
      return { error: 'Task not found' };
    }
    
    // Create clean update data to prevent circular references
    const cleanData: any = {};
    
    // Only include defined properties to avoid unnecessary updates
    if (data.project !== undefined) cleanData.project = data.project;
    if (data.task !== undefined) cleanData.task = data.task;
    if (data.status !== undefined) cleanData.status = mapStatusToPrismaEnum(data.status);
    if (data.priority !== undefined) cleanData.priority = mapPriorityToPrismaEnum(data.priority);
    if (data.duration !== undefined) cleanData.duration = data.duration;
    if (data.desc !== undefined) cleanData.desc = data.desc;
    if (data.tag !== undefined) cleanData.tag = data.tag;
    if (data.remark !== undefined) cleanData.remark = data.remark;
    if (data.date !== undefined) cleanData.date = data.date;
    if (data.hours !== undefined) cleanData.hours = data.hours;
    if (data.overtime !== undefined) cleanData.overtime = data.overtime;
    if (data.assignedTo !== undefined) cleanData.assignedTo = [...data.assignedTo];
    
    console.log('Clean update data:', JSON.stringify(cleanData, null, 2));
    
    const updatedTask = await db.task.update({
      where: { id },
      data: cleanData
    });
    
    console.log('Task successfully updated with ID:', updatedTask.id);
    
    // Map Prisma result to match the expected structure in frontend
    const simplifiedTask = {
      _id: updatedTask.id,
      id: updatedTask.id,
      project: updatedTask.project || '',
      task: updatedTask.task || '',
      status: updatedTask.status as unknown as string,
      priority: updatedTask.priority as unknown as string,
      duration: updatedTask.duration || '',
      desc: updatedTask.desc || '',
      tag: updatedTask.tag || '',
      remark: updatedTask.remark || '',
      date: updatedTask.date,
      hours: updatedTask.hours || 0,
      overtime: updatedTask.overtime || 0,
      assignedTo: updatedTask.assignedTo || [],
      linkedActivity: updatedTask.linkedActivity,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt
    };
    
    revalidatePath('/task');
    console.log('Revalidated path: /task');
    
    return { success: true, task: simplifiedTask };
  } catch (error: any) {
    console.error('Error updating task:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to update task' };
  }
}

export async function deleteTask(id: string) {
  console.log('=== Server Action: deleteTask ===');
  console.log('Deleting task ID:', id);
  
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log('User not authenticated for delete task');
      return { error: 'Not authenticated' };
    }

    console.log('Deleting task with Prisma');
    
    // First check if task exists
    const taskToDelete = await db.task.findUnique({
      where: { id }
    });
    
    if (!taskToDelete) {
      console.log('Task not found for deletion:', id);
      return { error: 'Task not found' };
    }
    
    // Log basic task info
    const taskInfo = {
      id: taskToDelete.id,
      task: taskToDelete.task || 'Unknown task',
      project: taskToDelete.project || 'Unknown project'
    };
    console.log('Found task to delete:', JSON.stringify(taskInfo, null, 2));
    
    // Delete the task
    await db.task.delete({
      where: { id }
    });
    
    console.log('Task successfully deleted:', id);
    revalidatePath('/task');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return { error: error.message || 'Failed to delete task' };
  }
}

// Generate tasks based on project activities
export async function generateTasksFromProject(projectId: string) {
  console.log('=== Server Action: generateTasksFromProject ===');
  console.log('Generating tasks from project ID:', projectId);
  
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log('User not authenticated for generating tasks');
      return { error: 'Not authenticated' };
    }

    console.log('Generating tasks with Prisma');
    
    // Get project details using Prisma
    const project = await db.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      console.log('Project not found:', projectId);
      return { error: 'Project not found' };
    }
    
    // Extract activities from the project
    const activities = project.activities as any[];
    if (!activities || activities.length === 0) {
      console.log('No activities found in the project');
      return { error: 'No activities found in the project' };
    }
    
    console.log(`Found ${activities.length} activities in project`);
    
    // First, remove existing tasks linked to this project to avoid duplicates
    console.log('Removing existing tasks linked to this project...');
    const deleteResult = await db.task.deleteMany({
      where: {
        linkedActivity: {
          path: ['projectId'],
          equals: projectId
        }
      }
    });
    
    console.log(`Deleted ${deleteResult.count} existing tasks`);
    
    // Group activities by system and subcategory to create tasks at the subcategory level
    const groupedActivities = new Map();
    
    // Group activities by "system-category-subcategory"
    activities.forEach((activity: Activity) => {
      const key = `${activity.system}-${activity.category}-${activity.subcategory}`;
      if (!groupedActivities.has(key)) {
        groupedActivities.set(key, {
          system: activity.system,
          category: activity.category,
          subcategory: activity.subcategory,
          activities: []
        });
      }
      groupedActivities.get(key).activities.push(activity.activity);
    });
    
    console.log(`Grouped activities into ${groupedActivities.size} subitems`);
    
    // Create one task per subcategory with proper enums
    const tasksToCreate = Array.from(groupedActivities.values()).map(group => ({
      project: project.customer,
      task: group.subcategory, // Use subcategory name as task name (e.g., "Overcurrent")
      club: group.system || '',
      status: 'pending' as TaskStatus,
      priority: 'pending' as TaskPriority,
      duration: "4",
      desc: `${group.subcategory} task for ${project.customer} under ${group.system}`,
      label: group.category || '',
      tag: group.system || '',
      remark: `Auto-generated from project "${project.customer}"`,
      linkedActivity: {
        projectId: projectId,
        system: group.system,
        category: group.category,
        subcategory: group.subcategory,
        activity: '' // No specific activity as this is at subcategory level
      },
      assignedTo: project.team || []
    }));
    
    if (tasksToCreate.length === 0) {
      console.log('No tasks to create after grouping subitems');
      return { 
        success: true, 
        message: 'No tasks to create from project subitems'
      };
    }
    
    console.log(`Creating ${tasksToCreate.length} tasks from subitems`);
    
    // Create tasks with Prisma
    const createdTasks = await db.task.createMany({
      data: tasksToCreate
    });
    
    console.log(`Successfully created ${createdTasks.count} tasks`);
    
    // Revalidate task page path to update UI
    revalidatePath('/task');
    console.log('Revalidated path: /task');
    
    return { 
      success: true, 
      message: `${createdTasks.count} tasks created from project subitems` 
    };
  } catch (error: any) {
    console.error('Error generating tasks from project:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to generate tasks' };
  }
}

// Sync all projects and tasks to ensure all project activities have corresponding tasks
export async function syncProjectsWithTasks() {
  console.log('=== Server Action: syncProjectsWithTasks ===');
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log('User not authenticated for sync operation');
      return { error: 'Not authenticated' };
    }

    console.log('Syncing projects with Prisma');
    
    // Get all projects using Prisma
    const projects = await db.project.findMany();
    console.log(`Found ${projects.length} projects to sync`);
    
    // Process each project
    const results = [];
    
    for (const project of projects) {
      try {
        const projectId = project.id;
        console.log(`Processing project: ${project.customer} (${projectId})`);
        
        // Generate tasks for this project
        const result = await generateTasksFromProject(projectId);
        
        results.push({
          projectId,
          name: project.customer,
          success: result.success,
          message: result.message || result.error
        });
      } catch (error: any) {
        console.error(`Error processing project ${project.id}:`, error);
        results.push({
          projectId: project.id,
          name: project.customer,
          success: false,
          message: error.message
        });
      }
    }
    
    console.log('Sync completed with results:', results);
    
    return { 
      success: true, 
      results,
      message: `Processed ${results.length} projects` 
    };
  } catch (error: any) {
    console.error('Error syncing projects with tasks:', error);
    return { error: error.message || 'Failed to sync projects with tasks' };
  }
}

// Helper function to map string status to Prisma enum
function mapStatusToPrismaEnum(status: string): TaskStatus {
  switch(status) {
    case 'stuck':
      return 'stuck';
    case 'in_progress':
      return 'in_progress';
    case 'done':
      return 'done';
    case 'pending':
    default:
      return 'pending';
  }
}

// Helper function to map string priority to Prisma enum
function mapPriorityToPrismaEnum(priority: string): TaskPriority {
  switch(priority) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    case 'pending':
    default:
      return 'pending';
  }
} 