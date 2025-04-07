import React from "react";
import { usePDF } from "react-to-pdf";
import IndexTable from "@/components/platform/project/itp/index-table";
import ActivityWrapper from "@/components/platform/project/itp/warpper";
import Action from "@/components/platform/project/layout/action";
import { SystemType } from "@/components/platform/project/constant";
import { getProject } from "@/components/platform/project/actions";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ITP({ params }: PageProps) {
  // Fetch project data using server action
  const result = await getProject(params.id);
  
  if (!result.success || !result.project) {
    return <div>Project not found</div>;
  }

  const project = result.project;
  
  // Get systems from project data
  const systems = project.systems as SystemType[];
  // Get activities from project data
  const activities = project.activities || [];
  
  return (
    <div className="flex flex-col gap-8 mb-10">
      <Action projectTitle={project.customer || ""} />
      <div className="space-y-8">
        <IndexTable systems={systems} />
        <ActivityWrapper systems={systems} activities={activities} />
      </div>
    </div>
  );
}
