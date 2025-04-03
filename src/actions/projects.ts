'use server';

import connectDB from "@/lib/mongodb";
import Project from "@/components/platform/project/model";
import { revalidatePath } from "next/cache";
import { SystemType } from "@/components/platform/project/constant";

export type ProjectData = {
  // Basic Information
  title: string;
  description: string;
  location: string;
  client: string;
  consultant: string;
  status: "Draft" | "Active" | "Completed" | "On Hold";
  
  // Team Information
  team: string[];
  teamLead: string;
  
  // Systems and Activities
  systems: SystemType[];
  activities: Array<{
    system: SystemType;
    category: string;
    subcategory: string;
    activity: string;
  }>;
  
  // Resources
  mobilization?: string;
  accommodation?: string;
  kits?: string[];
  cars?: string[];
  
  // Additional Fields
  startDate?: Date;
  endDate?: Date;
};

export async function createProject(data: ProjectData) {
  try {
    await connectDB();
    
    const project = await Project.create(data);
    
    revalidatePath('/project');
    
    return {
      success: true,
      project
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create project'
    };
  }
}

export async function getProjects() {
  try {
    await connectDB();
    
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    return {
      success: true,
      projects
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch projects'
    };
  }
}

export async function updateProject(id: string, data: Partial<ProjectData>) {
  try {
    await connectDB();
    
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    if (!project) {
      return {
        success: false,
        message: 'Project not found'
      };
    }
    
    revalidatePath('/project');
    
    return {
      success: true,
      project
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update project'
    };
  }
}

export async function deleteProject(id: string) {
  try {
    await connectDB();
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return {
        success: false,
        message: 'Project not found'
      };
    }
    
    revalidatePath('/project');
    
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete project'
    };
  }
} 