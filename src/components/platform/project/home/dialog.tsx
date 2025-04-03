"use client";
import React from "react";
import Create from "./crud/create";
import { Project } from '@/components/platform/project/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectDialogProps {
  projectToEdit?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({ projectToEdit, open, onOpenChange }: ProjectDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>
            {projectToEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {projectToEdit 
              ? "Update the details of your existing project" 
              : "Fill in the details to create a new project"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-2">
          <Create 
            projectToEdit={projectToEdit} 
            onSuccess={() => {
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDialog; 