'use client';

import Action from '@/components/platform/project/report/action';
import Level from '@/components/platform/project/report/level';
import { useProject } from '@/provider/project';
import React, { useEffect } from 'react'
import { usePDF } from 'react-to-pdf';

interface Params {
  id: string;
}

const Report = ({ params }: { params: Params }) => {
  const { project, fetchProject } = useProject();
  useEffect(() => {
    fetchProject(params.id);
  }, [params.id, fetchProject]);
  const { toPDF, targetRef } = usePDF({
    filename: `${project?.customer} ITP.pdf`,
  });
  return (
    <div>
      <Action projectTitle={project?.customer || ""} toPDF={toPDF} />
      <Level params={params} />
    </div>
  )
}

export default Report