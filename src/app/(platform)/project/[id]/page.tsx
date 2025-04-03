"use client";
import Action from "@/components/platform/project/layout/action";
import { useEffect, useState, useRef } from "react";
import Info from "@/components/platform/project/detial/info";
import { useProject } from "@/provider/project";
import React from "react";
import Loading from "@/components/atom/loading";

interface Params {
  id: string;
}

const Detail = ({ params }: { params: Params | Promise<Params> }) => {
  console.log("Detail component rendering, params:", params);
  
  // Properly unwrap params using React.use() for Next.js 15
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  console.log("Unwrapped params:", unwrappedParams);
  
  const id = unwrappedParams.id;
  console.log("Project ID:", id);
  
  const { project, fetchProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedProjectId = useRef<string | null>(null);

  useEffect(() => {
    // Prevent re-fetching if we already have the project data for this ID
    if (project && project._id === id && loadedProjectId.current === id) {
      console.log("Project already loaded for this ID, skipping fetch");
      setLoading(false);
      return;
    }

    console.log("Effect running with ID:", id);
    const loadProject = async () => {
      try {
        setLoading(true);
        console.log("Fetching project with ID:", id);
        await fetchProject(id);
        loadedProjectId.current = id;
        console.log("Project fetched, setting loading to false");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again.");
        setLoading(false);
      }
    };

    loadProject();
  }, [id, fetchProject, project]);

  console.log("Loading state:", loading);
  console.log("Project data:", project);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log("Rendering error:", error);
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!project) {
    console.log("Project not found");
    return <div className="p-4">Project not found</div>;
  }

  console.log("Rendering project details:", project);
  return (
    <div className="flex flex-col space-y-4 ">
      <Action projectTitle={project.customer} />
      <Info />
    </div>
  );
};

export default Detail;