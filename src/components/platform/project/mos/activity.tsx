'use client';
import React, { useEffect, useRef, useState } from "react";
import { HeadTitle } from "@/constant/project/itp/head";
import SubActivity from "./subactivity";
import { getProject } from '@/components/platform/project/actions';

interface IndexProps {
  params: Params | Promise<Params>;
  option: OptionKey;
  index: number;
}

interface Params {
  id: string;
}

type OptionKey =
  | "evSwgr"
  | "evTrafo"
  | "evCable"
  | "evRmu"
  | "hvSwgr"
  | "hvTrafo"
  | "hvCable"
  | "hvRmu"
  | "mvSwgr"
  | "mvTrafo"
  | "mvCable"
  | "mvRmu"
  | "lvSwgr"
  | "lvTrafo"
  | "lvCable"
  | "lvRmu";

const Activity: React.FC<IndexProps> = ({ params, option, index }) => {
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Safety check for params
  if (!params) {
    return null;
  }
  
  // Properly unwrap params using React.use() for Next.js 15
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  
  // Safety check for unwrapped params
  if (!unwrappedParams || !unwrappedParams.id) {
    return null;
  }
  
  const id = unwrappedParams.id;
  const loadedProjectId = useRef<string | null>(null);
  
  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      // Prevent re-fetching if we already have the project data for this ID
      if (project && loadedProjectId.current === id) {
        return;
      }
      
      try {
        const result = await getProject(id);
        if (result.success && result.project) {
          setProject(result.project);
          loadedProjectId.current = id;
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, project]);

  // Safety check for project
  if (!project) {
    return isLoading ? null : <div>Failed to load project data</div>;
  }

  const labels = HeadTitle(project)
    .map((item) => (item.value === option ? `${item.label}` : null))
    .filter(Boolean);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {labels.map((label, labelIndex) => (
        <h2
          key={labelIndex}>
          {`${index + labelIndex}. ${label}`}
        </h2>
      ))}
      <SubActivity params={unwrappedParams} option={option} index={index} project={project} />
    </div>
  );
};

export default Activity;
