"use client";
import { useProject } from "@/provider/project";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePDF } from "react-to-pdf";
import Action from "@/components/platform/project/layout/action";
import Breadcrumb from "@/components/platform/project/report/layout/crumb";

interface Params {
  id: string;
}

interface Option {
  label: string;
  value: string;
}

const Cable = ({ params }: { params: Params }) => {
  const { project, fetchProject } = useProject();

  useEffect(() => {
    fetchProject(params.id);
  }, [params.id, fetchProject]);
  const { toPDF, targetRef } = usePDF({
    filename: `${project?.customer} ITP.pdf`,
  });

  if (!project || !project.voltages.MV) {
    return null; // Don't render anything if the project data is not loaded yet or EV is not selected
  }

  const selectedOptions = project.mvOptions.mvCable;

  return (
    <div className="flex flex-col space-y-1 ">
      <Action projectTitle={project?.customer || ""} toPDF={toPDF} />
      <Breadcrumb params={params} />
      {selectedOptions.map((option: Option) => (
        <Link
          href={`/project/${params.id}/report/mv/cable/${option.label.toLowerCase()}`}
          key={option.value}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50"
        >
          <Icon icon={"ph:folder-simple-thin"} height="36" />
          <h2 className="mt-1">{option.label}</h2>
        </Link>
      ))}
    </div>
  );
};

export default Cable;
