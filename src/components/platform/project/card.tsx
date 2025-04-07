import React from 'react';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Project } from './types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Delete from "./delete";
import { toast } from 'sonner';
import { deleteProject } from './actions';

interface ProjectCardProps {
  project: Project;
  contextMenu: { x: number, y: number, projectID: string | null };
  onRightClick: (e: React.MouseEvent, projectID: string) => void;
  onCloseContextMenu: () => void;
  onOpenDialog: (projectId: string) => void;
  onProjectDeleted?: () => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  contextMenu,
  onRightClick,
  onCloseContextMenu,
  onOpenDialog,
  onProjectDeleted,
}) => {
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      <Card
        className={`border border-gray-400 hover:border-black h-48 ${contextMenu.projectID === project.id ? 'opacity-20' : ''}`}
        onContextMenu={(e) => {
          if (project.id) {
            onRightClick(e, project.id);
          }
        }}
      >
        <Link href={`/project/${project.id}`}>
          <CardHeader>
            <strong className="font-heading text-2xl">{project.customer}</strong>
            <p className="line-clamp-1 overflow-hidden text-ellipsis">
              {project.location ? project.location : <span className="opacity-50">Location</span>}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 -ml-1 items-center -mt-2">
              <Icon icon="material-symbols-light:bookmark-sharp" width={25}/>
              <p>{project.client || 'No Client'}</p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 items-center -mt-5">
            <div className={`rounded-full w-4 h-4 ${
              project.status === 'done' ? 'bg-green-500' :
              project.status === 'on_progress' ? 'bg-yellow-400' :
              project.status === 'stuck' ? 'bg-red-500' :
              'bg-neutral-400'
            }`}></div>
            <p className="capitalize">{project.status || 'pending'}</p>
          </CardFooter>
        </Link>
      </Card>

      {contextMenu.projectID === project.id && (
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center space-x-4 p-8"
          onMouseLeave={onCloseContextMenu}
        >
          <div className="flex items-center justify-center">
            <Delete id={contextMenu.projectID} onSuccess={onProjectDeleted} />
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => project.id && onOpenDialog(project.id)}
              className="flex gap-4 z-50"
            >
              <Icon icon="icon-park-solid:edit" width={40} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard; 