'use client';
import React, { useEffect, useState, useRef } from "react";
import { useProject } from "@/provider/project";

// Define the ContentActivity type
type Activity = {
  _id: string;
  title: string;
  system: string;
  category: string;
  description: string;
  body: {
    raw: string;
    code: string;
  };
  slug: string;
  url: string;
  [key: string]: any;
};

import ActivityComponent from "@/components/platform/project/mos/activity";

interface WrapperProps {
  params?: Params | Promise<Params>;
}

interface Params {
  id: string;
}

type OptionKey = 'evSwgr' | 'evTrafo' | 'evCable' | 'evRmu' | 'hvSwgr' | 'hvTrafo' | 'hvCable' | 'hvRmu' | 'mvSwgr' | 'mvTrafo' | 'mvCable' | 'mvRmu' | 'lvSwgr' | 'lvTrafo' | 'lvCable' | 'lvRmu';

interface ActivityWrapperProps {
  activities?: Activity[];
  children?: React.ReactNode;
}

/**
 * A wrapper component for MOS activities that handles loading states and empty states
 */
const ContentWrapper: React.FC<ActivityWrapperProps> = ({ activities = [], children }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [contentStatus, setContentStatus] = React.useState({
    checked: false,
    exists: false
  });
  
  React.useEffect(() => {
    // Simulate a loading delay to wait for content to be processed
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if content exists after the script has run
      setContentStatus({
        checked: true,
        exists: true // We'll assume content exists since we're showing children
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p>Loading MOS content...</p>
        </div>
      </div>
    );
  }
  
  return <div className="space-y-6">{children}</div>;
};

const ActivityWrapperComponent: React.FC<WrapperProps> = ({ params }) => {
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
  
  const { project, fetchProject } = useProject();
  const [ev, setEv] = useState<OptionKey[]>([]);
  const [hv, setHv] = useState<OptionKey[]>([]);
  const [mv, setMv] = useState<OptionKey[]>([]);
  const [lv, setLv] = useState<OptionKey[]>([]);
  const loadedProjectId = useRef<string | null>(null);

  useEffect(() => {
    // Prevent re-fetching if we already have the project data for this ID
    if (project && project._id === id && loadedProjectId.current === id) {
      return;
    }
    
    fetchProject(id);
    loadedProjectId.current = id;
  }, [id, fetchProject, project]);

  useEffect(() => {
    if (project) {
      // Check if evOptions, hvOptions, etc. exist before using them
      const Ev = project.evOptions || {};
      const Hv = project.hvOptions || {};
      const Mv = project.mvOptions || {};
      const Lv = project.lvOptions || {};
  
      const selectedKey: OptionKey[] = ['evSwgr', 'evTrafo', 'evCable', 'evRmu', 'hvSwgr', 'hvTrafo', 'hvCable', 'hvRmu', 'mvSwgr', 'mvTrafo', 'mvCable', 'mvRmu', 'lvSwgr', 'lvTrafo', 'lvCable', 'lvRmu'];
      
      const newEv = selectedKey.filter(key => Ev[key] && Ev[key].length > 0);
      setEv(newEv);

      const newHv = selectedKey.filter(key => Hv[key] && Hv[key].length > 0);
      setHv(newHv);

      const newMv = selectedKey.filter(key => Mv[key] && Mv[key].length > 0);
      setMv(newMv);

      const newLv = selectedKey.filter(key => Lv[key] && Lv[key].length > 0);
      setLv(newLv);
    }
  }, [project]);

  if (!project) {
    return <div className="p-4 text-muted-foreground">Loading project data...</div>;
  }

  return (
    <>
      {ev.map((option, index) => (
        <ActivityComponent key={option} params={unwrappedParams} option={option} index={index + 1} />
      ))}
      {hv.map((option, index) => (
        <ActivityComponent key={option} params={unwrappedParams} option={option} index={ev.length + index + 1} />
      ))}
      {mv.map((option, index) => (
        <ActivityComponent key={option} params={unwrappedParams} option={option} index={ev.length + hv.length + index + 1} />
      ))}
      {lv.map((option, index) => (
        <ActivityComponent key={option} params={unwrappedParams} option={option} index={ev.length + hv.length + mv.length + index + 1} />
      ))}
    </>
  );
};

// Export both components for different use cases
export { ContentWrapper as ActivityWrapper };
export default ActivityWrapperComponent;