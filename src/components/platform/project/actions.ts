'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Project from './model';
import { ProjectFormValues } from './validation';
import { auth } from '../../../../auth';
import { Project as ProjectType } from './types';

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

export async function createProject(data: ProjectFormValues) {
  console.log('=== Server Action: createProject ===');
  console.log('Received data:', JSON.stringify(data, null, 2));
  
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.error('Authentication failed: No user session');
      return { success: false, message: 'Authentication required' };
    }
    
    console.log('Attempting to connect to database...');
    await connectDB();
    console.log('Database connection successful');
    
    console.log('Creating project with data:', JSON.stringify(data, null, 2));
    const project = await Project.create({
      customer: data.customer,
      description: data.description,
      location: data.location,
      client: data.client,
      consultant: data.consultant,
      status: data.status,
      priority: data.priority,
      phase: data.phase,
      team: data.team,
      teamLead: data.teamLead,
      systems: data.systems,
      activities: data.activities,
      mobilization: data.mobilization,
      accommodation: data.accommodation,
      kits: data.kits,
      cars: data.cars,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    console.log('Project created successfully:', JSON.stringify(project, null, 2));

    console.log('Revalidating project path...');
    revalidatePath('/platform/project');
    console.log('Path revalidation complete');
    
    // Serialize the project before returning
    const serializedProject = serializeDocument(project.toObject ? project.toObject() : project);
    
    return { success: true, data: serializedProject };
  } catch (error: any) {
    console.error('Error in createProject:', {
      name: error?.name || 'Unknown',
      message: error?.message || 'No error message',
      stack: error?.stack || 'No stack trace',
      code: error?.code,
      keyPattern: error?.keyPattern,
      keyValue: error?.keyValue
    });

    // Handle specific MongoDB errors
    if (error?.code === 11000) {
      return { success: false, message: 'A project with this name already exists' };
    }
    
    if (error?.name === 'ValidationError') {
      return { success: false, message: 'Invalid project data provided' };
    }

    return { 
      success: false, 
      message: error?.message || 'Failed to create project',
      details: error?.code ? `Error code: ${error.code}` : undefined
    };
  }
}

export async function getProjects() {
  console.log('=== Server Action: getProjects ===');
  
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.error('Authentication failed: No user session');
      return { success: false, message: 'Authentication required' };
    }
    
    console.log('Attempting to connect to database...');
    await connectDB();
    console.log('Database connection successful');
    
    console.log('Fetching projects...');
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Found ${projects.length} projects`);
    
    // Serialize all projects and their nested objects
    const serializedProjects = projects.map(project => serializeDocument(project));
    
    return { success: true, data: serializedProjects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch projects' };
  }
}

export async function getProject(id: string) {
  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) {
      return { success: false, message: 'Project not found' };
    }
    
    // Serialize the project before returning
    const serializedProject = serializeDocument(project);
    
    return { success: true, data: serializedProject };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, message: 'Failed to fetch project' };
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormValues>) {
  console.log('=== Server Action: updateProject ===');
  console.log('Project ID:', id);
  console.log('Update data:', JSON.stringify(data, null, 2));
  
  try {
    console.log('Attempting to connect to database...');
    await connectDB();
    console.log('Database connection successful');
    
    console.log('Finding and updating project...');
    const project = await Project.findByIdAndUpdate(
      id,
      {
        customer: data.customer,
        description: data.description,
        location: data.location,
        client: data.client,
        consultant: data.consultant,
        status: data.status,
        priority: data.priority,
        phase: data.phase,
        team: data.team,
        teamLead: data.teamLead,
        systems: data.systems,
        activities: data.activities,
        mobilization: data.mobilization,
        accommodation: data.accommodation,
        kits: data.kits,
        cars: data.cars,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      { new: true }
    );

    if (!project) {
      console.log('Project not found with ID:', id);
      return { success: false, message: 'Project not found' };
    }

    console.log('Project updated successfully:', JSON.stringify(project, null, 2));
    console.log('Revalidating project path...');
    revalidatePath('/platform/project');
    console.log('Path revalidation complete');

    // Serialize the project before returning
    const serializedProject = serializeDocument(project.toObject ? project.toObject() : project);
    
    return { success: true, data: serializedProject };
  } catch (error: any) {
    console.error('=== Error in updateProject ===');
    console.error('Error type:', error?.constructor?.name || 'Unknown');
    console.error('Error message:', error?.message || 'No error message');
    console.error('Error stack:', error?.stack || 'No stack trace');
    
    // Handle MongoDB specific errors
    if (error?.code === 11000) {
      console.error('Duplicate key error:', error.keyPattern);
      return { success: false, message: 'A project with this information already exists' };
    }
    
    // Handle validation errors
    if (error?.name === 'ValidationError') {
      console.error('Validation errors:', Object.values(error.errors).map((err: any) => err.message));
      return { success: false, message: 'Validation failed', errors: Object.values(error.errors).map((err: any) => err.message) };
    }

    // Handle other MongoDB errors
    console.error('Error details:', {
      name: error?.name || 'Unknown',
      code: error?.code,
      keyPattern: error?.keyPattern,
      keyValue: error?.keyValue
    });
    
    return { 
      success: false, 
      message: error?.message || 'Failed to update project',
      error: error?.message || 'Unknown error'
    };
  }
}

export async function deleteProject(id: string) {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    revalidatePath('/platform/project');
    
    // Serialize the project before returning
    const serializedProject = serializeDocument(project.toObject ? project.toObject() : project);
    
    return { success: true, data: serializedProject };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { success: false, message: error?.message || 'Failed to delete project' };
  }
} 