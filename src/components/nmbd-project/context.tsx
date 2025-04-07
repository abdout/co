"use client";


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, ProjectContextProps } from './type';

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProject = useCallback(async (id: string) => {
    try {
      console.log(`Context: Fetching project with id: ${id}`);
      
      // Add cache busting to avoid stale responses
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/project/${id}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        }
      });
      
      console.log(`Context: Response status: ${response.status} ${response.statusText}`);
      console.log(`Context: Response type: ${response.headers.get('content-type')}`);
    
      if (!response.ok) {
        console.error(`Context: Failed to fetch project: ${response.status} ${response.statusText}`);
        return;
      }
    
      try {
        const data = await response.json();
        console.log('Context: Successfully parsed project JSON');
      
        if (!data || typeof data !== 'object' || !data.project || typeof data.project !== 'object' || !data.project._id) {
          console.error('Context: Unexpected project data format:', data);
          return;
        }
      
        setProject(data.project);
        console.log('Context: Updated project state:', data.project);
      } catch (jsonError) {
        console.error('Context: Failed to parse project JSON:', jsonError);
        
        // Fallback to text parsing
        try {
          const text = await response.text();
          console.error('Context: Raw project response:', text.substring(0, 200));
        } catch (textError) {
          console.error('Context: Failed to get response text:', textError);
        }
      }
    } catch (error) {
      console.error('Context: Error fetching project:', error);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Context: Fetching projects');
      
      // Add cache busting to avoid stale responses
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/project?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        }
      });
      
      console.log(`Context: Response status: ${res.status} ${res.statusText}`);
      console.log(`Context: Response type: ${res.headers.get('content-type')}`);
      
      if (!res.ok) {
        console.error(`Context: Error fetching projects: ${res.status} ${res.statusText}`);
        setProjects([]);
        return;
      }
      
      // First try to get JSON directly
      try {
        const data = await res.json();
        console.log('Context: Successfully parsed JSON directly');
        
        if (data && Array.isArray(data.projects)) {
          console.log(`Context: Successfully fetched ${data.projects.length} projects`);
          setProjects(data.projects);
        } else {
          console.error('Context: Invalid projects data format:', data);
          setProjects([]);
        }
        
        // If there was an error message but we still got some data
        if (data.error) {
          console.warn('Context: Server returned warning:', data.error);
        }
        return;
      } catch (jsonError) {
        console.warn('Context: Could not parse JSON directly, falling back to text:', jsonError);
        // Fall back to text method if direct JSON parsing fails
      }
      
      // Fallback to text parsing
      const text = await res.text();
      
      if (!text) {
        console.error('Context: Empty response received from server');
        setProjects([]);
        return;
      }
      
      console.log(`Context: Raw response (first 100 chars): ${text.substring(0, 100)}...`);
      
      try {
        const data = JSON.parse(text);
        
        if (data && Array.isArray(data.projects)) {
          console.log(`Context: Successfully fetched ${data.projects.length} projects`);
          setProjects(data.projects);
        } else {
          console.error('Context: Invalid projects data format:', data);
          setProjects([]);
        }
        
        // If there was an error message but we still got some data
        if (data.error) {
          console.warn('Context: Server returned warning:', data.error);
        }
      } catch (parseError) {
        console.error('Context: Failed to parse JSON response:', parseError);
        console.error('Context: Response starts with:', text.substring(0, 100));
        setProjects([]);
      }
    } catch (error) {
      console.error('Context: Failed to fetch projects:', error);
      setProjects([]);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      console.log(`Context: Deleting project with ID: ${id}`);
      
      const res = await fetch(`/api/project?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`Context: Delete response status: ${res.status} ${res.statusText}`);
      
      if (!res.ok) {
        console.error(`Context: Error deleting project: ${res.status} ${res.statusText}`);
        return;
      }
      
      try {
        const data = await res.json();
        console.log('Context: Delete response data:', data);
        
        if (data.success) {
          console.log('Context: Project deleted successfully');
          await fetchProjects();
        } else {
          console.error('Context: Server reported error:', data.error || 'Unknown error');
        }
      } catch (jsonError) {
        console.error('Context: Failed to parse delete response:', jsonError);
        
        // Still refresh the list in case it succeeded but returned invalid JSON
        await fetchProjects();
      }
    } catch (error) {
      console.error('Context: Failed to delete project:', error);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ project, projects, fetchProject, fetchProjects, refreshProjects, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};