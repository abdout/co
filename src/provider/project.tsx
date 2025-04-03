"use client";
import { domain } from '@/constant/domain';
import { Project, ProjectContextProps } from '@/components/platform/project/project';
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const fetchProject = async (id: string) => {
    console.log(`ProjectProvider: Fetching project with ID: ${id}`);
    try {
      const response = await fetch(`/api/project/${id}`);
      console.log(`ProjectProvider: API Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`ProjectProvider: Project data received:`, data);
      
      if (!data.project) {
        console.error('ProjectProvider: No project data in response', data);
        return;
      }
      
      setProject(data.project);
      console.log(`ProjectProvider: Project state updated`, data.project);
    } catch (error) {
      console.error(`ProjectProvider: Error fetching project:`, error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/project`);
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ project, projects, fetchProject, fetchProjects, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};