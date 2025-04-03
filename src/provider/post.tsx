'use client';
import { domain } from "@/constant/domain";
import { PostProjectContextProps, PostProjectState } from "@/components/platform/project/post";
import React, { createContext, useState, useContext, useEffect } from "react";
import { createProject, type ProjectData } from "@/actions/projects";
import { createTask, type TaskData } from "@/actions/tasks";

const PostProjectContext = createContext<PostProjectContextProps | undefined>(undefined);

export const usePostProject = () => {
  console.log("usePostProject: Hook called");
  const context = useContext(PostProjectContext);
  if (!context) {
    console.error("usePostProject: No context found, make sure to use within a PostProjectProvider");
    throw new Error('usePostProject must be used within a PostProjectProvider');
  }
  return context;
};

export const PostProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("PostProjectProvider: Initializing");
  const [postProjectState, setPostProjectState] = useState<PostProjectState>({ status: 'idle', error: null });
  
  useEffect(() => {
    console.log("PostProjectProvider: State changed", postProjectState);
  }, [postProjectState]);

  const postTask = async (taskData: TaskData) => {
    console.log("PostProjectProvider: Posting task", taskData);
    try {
      // Use server action instead of fetch
      console.log("PostProjectProvider: Using createTask server action");
      const result = await createTask(taskData);
      
      if (!result.success) {
        console.error("PostProjectProvider: Failed to create task", result.error);
        throw new Error(`Failed to create a task: ${result.error}`);
      }
      console.log("PostProjectProvider: Task created successfully");
      return result.task;
    } catch (error) {
      console.error("PostProjectProvider: Error creating task", error);
      throw error;
    }
  };

  const postProject = async (data: ProjectData) => {
    console.log("PostProjectProvider: postProject called with data", data);
    setPostProjectState({ status: 'loading', error: null });
    
    try {
      // Use server action instead of fetch
      console.log("PostProjectProvider: Using createProject server action");
      const result = await createProject(data);
      
      if (!result.success) {
        console.error("PostProjectProvider: Server action returned error", result.error);
        throw new Error(`Failed to create a project: ${result.error}`);
      }
      
      console.log("PostProjectProvider: Project created successfully");
  
      const getTaskTitles = (data: any) => {
        console.log("PostProjectProvider: Extracting task titles from data");
        const options = [
          'lvSwgr', 'lvTrafo', 'lvCable', 'lvRmu',
          'mvSwgr', 'mvTrafo', 'mvCable', 'mvRmu',
          'hvSwgr', 'hvTrafo', 'hvCable', 'hvRmu',
          'evSwgr', 'evTrafo', 'evCable', 'evRmu',
        ];
      
        const taskTitles: string[] = [];
      
        for (const voltage of ['lvOptions', 'mvOptions', 'hvOptions', 'evOptions']) {
          for (const option of options) {
            if (data[voltage][option]) {
              if (Array.isArray(data[voltage][option])) {
                for (const item of data[voltage][option]) {
                  taskTitles.push(item.label);
                }
              } else {
                taskTitles.push(data[voltage][option].label);
              }
            }
          }
        }
        
        console.log("PostProjectProvider: Extracted task titles", taskTitles);
        return taskTitles;
      };
      
      // Inside the postProject function
      const taskTitles = getTaskTitles(data);
      console.log("PostProjectProvider: Creating tasks for project", taskTitles.length);
      
      for (const title of taskTitles) {
        console.log("PostProjectProvider: Creating task", title);
        await postTask({
          project: data.customer,
          task: title,
          club: "",
          status: "In Progress",
          priority: "Medium",
          duration: "4",
          desc: `Task for ${data.customer} project`,
          label: "",
          tag: "",
          remark: ""
        });
      }
      console.log("PostProjectProvider: All tasks created successfully");
      setPostProjectState({ status: 'succeeded', error: null });
    } catch (error) {
      console.error("PostProjectProvider: Error in postProject", error);
      setPostProjectState({ status: 'failed', error });
    }
  };

  return (
    <PostProjectContext.Provider value={{ postProjectState, postProject }}>
      {children}
    </PostProjectContext.Provider>
  );
};