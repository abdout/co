"use client";
import { useProject } from "@/provider/project";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface IndexProps {
  params: Params | Promise<Params>;
}

interface Params {
  id: string;
}

const Level: React.FC<IndexProps> = ({ params }) => {
  // Properly unwrap params using React.use() for Next.js 15
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const id = unwrappedParams.id;
  const { project, fetchProject } = useProject();

  useEffect(() => {
    fetchProject(id);
  }, [id, fetchProject]);

  if (!project) {
    return null; // Don't render anything if the project data is not loaded yet
  }

  const selectedVoltages = ["EV", "HV", "MV", "LV"].filter(
    (voltage) => project.voltages[voltage as keyof typeof project.voltages]
  );

  return (
    <div className="flex flex-col">
      {selectedVoltages.map((voltage) => (
        <Link
          href={`/project/${id}/report/${voltage.toLowerCase()}`}
          key={voltage}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50"
        >
          <Icon icon={"ph:folder-simple-thin"} height="36" />
          <h2 className="mt-1">{voltage}</h2>
        </Link>
      ))}
    </div>
  );
};

export default Level;