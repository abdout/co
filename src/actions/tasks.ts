'use server';

import connectDB from "@/lib/mongodb";
import Task from "@/components/platform/task/model";
import { revalidatePath } from "next/cache";

export type TaskData = {
  project: string;
  task: string;
  club: string;
  status: string;
  priority: string;
  duration: string;
  desc: string;
  label: string;
  tag: string;
  remark: string;
};

export async function createTask(data: TaskData) {
  console.log('Server Action: Creating task with data', data);
  
  try {
    // Connect to database
    await connectDB();
    
    // Create task in database
    const newTask = new Task({
      project: data.project,
      task: data.task,
      club: data.club,
      status: data.status,
      priority: data.priority,
      duration: data.duration,
      desc: data.desc,
      label: data.label,
      tag: data.tag,
      remark: data.remark
    });

    await newTask.save();
    console.log('Server Action: Task created successfully', newTask);
    
    // Revalidate relevant paths
    revalidatePath('/project');
    
    return { 
      success: true, 
      message: "Task Created", 
      task: JSON.parse(JSON.stringify(newTask)) 
    };
  } catch (error) {
    console.error('Server Action: Error creating task', error);
    return { 
      success: false, 
      message: "Failed to create task", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function getTasks() {
  try {
    await connectDB();
    const tasks = await Task.find();
    return { 
      success: true, 
      tasks: JSON.parse(JSON.stringify(tasks)) 
    };
  } catch (error) {
    console.error('Server Action: Error getting tasks', error);
    return { 
      success: false, 
      message: "Failed to get tasks", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function deleteTask(id: string) {
  try {
    await connectDB();
    await Task.findByIdAndDelete(id);
    revalidatePath('/project');
    return { success: true, message: "Task deleted" };
  } catch (error) {
    console.error('Server Action: Error deleting task', error);
    return { 
      success: false, 
      message: "Failed to delete task", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
} 