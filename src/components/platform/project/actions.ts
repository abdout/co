'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ProjectFormValues } from './validation';
import { auth } from '../../../../auth';
import { Project as ProjectType } from './types';

export async function createProject(data: ProjectFormValues | null) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    if (!data) {
      return { success: false, error: 'No data provided' };
    }

    const projectData = {
      customer: data.customer || '',
      description: data.description || '',
      location: data.location || '',
      client: data.client || '',
      consultant: data.consultant || '',
      status: data.status || 'pending',
      priority: data.priority || 'pending',
      phase: data.phase || 'approved',
      team: Array.isArray(data.team) ? data.team : [],
      teamLead: data.teamLead || '',
      systems: Array.isArray(data.systems) ? data.systems : [],
      activities: Array.isArray(data.activities) ? data.activities : [],
      mobilization: data.mobilization || '',
      accommodation: data.accommodation || '',
      kits: Array.isArray(data.kits) ? data.kits : [],
      cars: Array.isArray(data.cars) ? data.cars : [],
      startDate: data.startDate || new Date(),
      endDate: data.endDate || null,
    };

    console.log('Creating project with data:', JSON.stringify(projectData, null, 2));

    const project = await db.project.create({
      data: projectData,
    });

    revalidatePath('/project');
    return { success: true, project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create project' };
  }
}

export async function getProjects() {
  try {
    const session = await auth();
    if (!session?.user) {
      console.error('Unauthorized access attempt');
      return { success: false, error: 'Unauthorized' };
    }

    console.log('Fetching projects...');
    
    const projects = await db.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Projects fetched:', projects);

    if (!projects || projects.length === 0) {
      console.log('No projects found');
      return { success: true, projects: [] };
    }

    return { success: true, projects };
  } catch (error) {
    console.error('Error in getProjects:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch projects',
      details: error instanceof Error ? error.stack : undefined
    };
  }
}

export async function getProject(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        customer: true,
        description: true,
        location: true,
        client: true,
        consultant: true,
        status: true,
        priority: true,
        phase: true,
        team: true,
        teamLead: true,
        systems: true,
        activities: true,
        mobilization: true,
        accommodation: true,
        kits: true,
        cars: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    return { success: true, project };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch project' };
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormValues> | null) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    if (!data) {
      return { success: false, error: 'No data provided' };
    }

    const projectData = {
      customer: data.customer,
      description: data.description,
      location: data.location,
      client: data.client,
      consultant: data.consultant,
      status: data.status,
      priority: data.priority,
      phase: data.phase,
      team: Array.isArray(data.team) ? data.team : undefined,
      teamLead: data.teamLead,
      systems: Array.isArray(data.systems) ? data.systems : undefined,
      activities: Array.isArray(data.activities) ? data.activities : undefined,
      mobilization: data.mobilization,
      accommodation: data.accommodation,
      kits: Array.isArray(data.kits) ? data.kits : undefined,
      cars: Array.isArray(data.cars) ? data.cars : undefined,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    const project = await db.project.update({
      where: { id },
      data: projectData,
    });

    revalidatePath('/project');
    revalidatePath(`/project/${id}`);
    return { success: true, project };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    await db.project.delete({
      where: { id },
    });

    revalidatePath('/project');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete project' };
  }
} 