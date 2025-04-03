'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task from './model';
import { TaskFormValues } from './validation';
import { auth } from '../../../../auth';
import { Task as TaskType, Activity } from './type';
import Project from '../project/model';
import { TASK_STATUS, TASK_PRIORITY } from './constant';

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
    await connectDB();
    console.log('Connected to DB for create operation');
    
    // Create a clean object to prevent circular references
    const cleanData = {
      project: data.project,
      task: data.task,
      status: data.status,
      priority: data.priority,
      duration: data.duration,
      desc: data.desc,
      tag: data.tag || '',
      remark: data.remark || '',
      date: data.date,
      hours: data.hours,
      overtime: data.overtime,
      assignedTo: data.assignedTo ? [...data.assignedTo] : []
    };
    
    // Log the sanitized data
    console.log('Sanitized data for task creation:', JSON.stringify(cleanData, null, 2));
    
    // Create new task with cleaned data
    const newTask = new Task(cleanData);
    console.log('Task model instance created with ID:', newTask._id);
    
    const savedTask = await newTask.save();
    console.log('Task saved to database with ID:', savedTask._id.toString());
    
    revalidatePath('/task');
    console.log('Revalidated path: /task');
    
    return { success: true, taskId: savedTask._id.toString() };
  } catch (error: any) {
    console.error('Error creating task:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to create task' };
  }
}

export async function getTasks() {
  console.log('=== Server Action: getTasks ===');
  try {
    await connectDB();
    console.log('Connected to DB for fetching tasks');
    
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    console.log(`Fetched ${tasks.length} tasks from database`);
    
    // Create a simpler, safer serialization approach
    const simplifiedTasks = tasks.map(task => {
      // Convert Mongoose document to plain object
      const plainTask = task.toObject ? task.toObject() : task;
      
      return {
        _id: plainTask._id.toString(),
        project: plainTask.project || '',
        task: plainTask.task || '',
        status: plainTask.status || '',
        priority: plainTask.priority || '',
        duration: plainTask.duration || '',
        desc: plainTask.desc || '',
        club: plainTask.club || '',
        tag: plainTask.tag || '',
        remark: plainTask.remark || '',
        label: plainTask.label || '',
        date: plainTask.date ? new Date(plainTask.date) : undefined,
        hours: plainTask.hours || 0,
        overtime: plainTask.overtime || 0,
        assignedTo: plainTask.assignedTo || [],
        createdAt: plainTask.createdAt ? new Date(plainTask.createdAt) : undefined,
        updatedAt: plainTask.updatedAt ? new Date(plainTask.updatedAt) : undefined
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
    await connectDB();
    const task = await Task.findById(id);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    // Create a simplified task object for the response
    const plainTask = task.toObject ? task.toObject() : task;
    const simplifiedTask = {
      _id: plainTask._id.toString(),
      project: plainTask.project || '',
      task: plainTask.task || '',
      status: plainTask.status || '',
      priority: plainTask.priority || '',
      duration: plainTask.duration || '',
      desc: plainTask.desc || '',
      club: plainTask.club || '',
      tag: plainTask.tag || '',
      remark: plainTask.remark || '',
      label: plainTask.label || '',
      date: plainTask.date ? new Date(plainTask.date) : undefined,
      hours: plainTask.hours || 0,
      overtime: plainTask.overtime || 0,
      assignedTo: plainTask.assignedTo || [],
      createdAt: plainTask.createdAt ? new Date(plainTask.createdAt) : undefined,
      updatedAt: plainTask.updatedAt ? new Date(plainTask.updatedAt) : undefined
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
    await connectDB();
    console.log('Connected to DB for update operation');
    
    // Check if task exists before update
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      console.log('Task not found for update:', id);
      return { error: 'Task not found' };
    }
    
    // Create clean update data to prevent circular references
    const cleanData: Partial<TaskFormValues> = {};
    
    // Only include defined properties to avoid unnecessary updates
    if (data.project !== undefined) cleanData.project = data.project;
    if (data.task !== undefined) cleanData.task = data.task;
    if (data.status !== undefined) cleanData.status = data.status;
    if (data.priority !== undefined) cleanData.priority = data.priority;
    if (data.duration !== undefined) cleanData.duration = data.duration;
    if (data.desc !== undefined) cleanData.desc = data.desc;
    if (data.tag !== undefined) cleanData.tag = data.tag;
    if (data.remark !== undefined) cleanData.remark = data.remark;
    if (data.date !== undefined) cleanData.date = data.date;
    if (data.hours !== undefined) cleanData.hours = data.hours;
    if (data.overtime !== undefined) cleanData.overtime = data.overtime;
    if (data.assignedTo !== undefined) cleanData.assignedTo = [...data.assignedTo];
    
    console.log('Clean update data:', JSON.stringify(cleanData, null, 2));
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: cleanData },
      { new: true }
    );
    
    if (!updatedTask) {
      console.log('Failed to update task:', id);
      return { error: 'Task not found' };
    }
    
    console.log('Task successfully updated with ID:', updatedTask._id.toString());
    
    // Create a simplified task object for the response
    const plainTask = updatedTask.toObject ? updatedTask.toObject() : updatedTask;
    const simplifiedTask = {
      _id: plainTask._id.toString(),
      project: plainTask.project || '',
      task: plainTask.task || '',
      status: plainTask.status || '',
      priority: plainTask.priority || '',
      duration: plainTask.duration || '',
      desc: plainTask.desc || '',
      tag: plainTask.tag || '',
      remark: plainTask.remark || '',
      date: plainTask.date ? new Date(plainTask.date) : undefined,
      hours: plainTask.hours || 0,
      overtime: plainTask.overtime || 0,
      assignedTo: plainTask.assignedTo || [],
      createdAt: plainTask.createdAt ? new Date(plainTask.createdAt) : undefined,
      updatedAt: plainTask.updatedAt ? new Date(plainTask.updatedAt) : undefined
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

    await connectDB();
    console.log('Connected to DB for delete operation');
    
    const taskToDelete = await Task.findById(id);
    if (!taskToDelete) {
      console.log('Task not found for deletion:', id);
      return { error: 'Task not found' };
    }
    
    // Log basic task info instead of full serialized object
    const taskInfo = {
      _id: taskToDelete._id.toString(),
      task: taskToDelete.task || 'Unknown task',
      project: taskToDelete.project || 'Unknown project'
    };
    console.log('Found task to delete:', JSON.stringify(taskInfo, null, 2));
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      console.log('Failed to delete task:', id);
      return { error: 'Task not found' };
    }
    
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

    await connectDB();
    console.log('Connected to DB for generating tasks');
    
    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found:', projectId);
      return { error: 'Project not found' };
    }
    
    // Extract activities from the project
    const { activities } = project;
    if (!activities || activities.length === 0) {
      console.log('No activities found in the project');
      return { error: 'No activities found in the project' };
    }
    
    console.log(`Found ${activities.length} activities in project`);
    
    // First, remove existing tasks linked to this project to avoid duplicates
    console.log('Removing existing tasks linked to this project...');
    const deleteResult = await Task.deleteMany({
      'linkedActivity.projectId': projectId
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing tasks`);
    
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
    
    // Create one task per subcategory
    const tasksToCreate = Array.from(groupedActivities.values()).map(group => ({
      project: project.customer,
      task: group.subcategory, // Use subcategory name as task name (e.g., "Overcurrent")
      club: group.system || '',
      status: "pending",
      priority: "pending",
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
    
    // Create tasks in bulk
    const createdTasks = await Task.insertMany(tasksToCreate);
    console.log(`Successfully created ${createdTasks.length} tasks`);
    
    // Revalidate task page path to update UI
    revalidatePath('/task');
    console.log('Revalidated path: /task');
    
    return { 
      success: true, 
      message: `${createdTasks.length} tasks created from project subitems` 
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
      console.log('User not authenticated for syncing projects with tasks');
      return { error: 'Not authenticated' };
    }

    await connectDB();
    console.log('Connected to DB for syncing projects with tasks');
    
    // Get all projects
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to check for tasks`);
    
    let totalTasksCreated = 0;
    let processedProjects = 0;
    
    // Process each project
    for (const project of projects) {
      console.log(`Processing project: ${project.customer} (ID: ${project._id})`);
      
      // Skip projects without activities
      if (!project.activities || project.activities.length === 0) {
        console.log(`Project ${project.customer} has no activities to sync`);
        processedProjects++;
        continue;
      }
      
      // Group activities by system and subcategory
      const groupedActivities = new Map();
      
      // Group activities by "system-category-subcategory"
      project.activities.forEach((activity: Activity) => {
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
      
      // Check existing tasks for this project
      const existingTasks = await Task.find({
        'linkedActivity.projectId': project._id.toString()
      });
      
      // Create a map of existing tasks by subcategory for quick lookup
      const existingTaskMap = new Map();
      existingTasks.forEach(task => {
        if (task.linkedActivity) {
          const key = `${task.linkedActivity.system}-${task.linkedActivity.category}-${task.linkedActivity.subcategory}`;
          existingTaskMap.set(key, task);
        }
      });
      
      // Find subitems without tasks
      const subitemsNeedingTasks = [];
      for (const [key, group] of groupedActivities.entries()) {
        if (!existingTaskMap.has(key)) {
          subitemsNeedingTasks.push(group);
        }
      }
      
      if (subitemsNeedingTasks.length === 0) {
        console.log(`Project ${project.customer} has all subitems synced with tasks`);
        processedProjects++;
        continue;
      }
      
      console.log(`Found ${subitemsNeedingTasks.length} subitems without tasks in project ${project.customer}`);
      
      // Create tasks for these subitems
      const tasksToCreate = subitemsNeedingTasks.map(group => ({
        project: project.customer,
        task: group.subcategory, // Use subcategory name as task name (e.g., "Overcurrent")
        club: group.system || '',
        status: "pending",
        priority: "pending",
        duration: "4",
        desc: `${group.subcategory} task for ${project.customer} under ${group.system}`,
        label: group.category || '',
        tag: group.system || '',
        remark: `Auto-generated from project "${project.customer}"`,
        linkedActivity: {
          projectId: project._id.toString(),
          system: group.system,
          category: group.category,
          subcategory: group.subcategory,
          activity: '' // No specific activity as this is at subcategory level
        },
        assignedTo: project.team || []
      }));
      
      // Create these tasks
      if (tasksToCreate.length > 0) {
        const createdTasks = await Task.insertMany(tasksToCreate);
        console.log(`Created ${createdTasks.length} new tasks for project ${project.customer}`);
        totalTasksCreated += createdTasks.length;
      }
      
      processedProjects++;
    }
    
    // Revalidate task page path
    revalidatePath('/task');
    
    return {
      success: true,
      message: `Synced ${processedProjects} projects and created ${totalTasksCreated} new tasks`
    };
  } catch (error: any) {
    console.error('Error syncing projects with tasks:', error);
    console.error('Error stack:', error.stack);
    return { error: error.message || 'Failed to sync projects with tasks' };
  }
} 