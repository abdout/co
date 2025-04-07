'use client';

import { Mail, Phone, MapPin, File, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TeamDetailProps } from "./types";

const TeamDetail = ({ team, onClose }: TeamDetailProps) => {
  const handleOpenIqama = () => {
    if (team.iqama) {
      window.open(team.iqama, '_blank');
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Team Member Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onClose && onClose()}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="relative h-[150px] w-[150px] rounded-full overflow-hidden bg-muted">
            <img
              src={team.src || team.userImage || "/placeholder-avatar.jpg"}
              alt={team.alt || `${team.firstName} ${team.lastName}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold">
            {team.firstName} {team.lastName}
          </h2>
          
          {team.userName && (
            <div className="mt-1 flex items-center gap-1 text-sm text-blue-600 font-medium">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="text-blue-600"
              >
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
              <span>@{team.userName}</span>
            </div>
          )}
          
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{team.location}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
            <a
              href={`mailto:${team.mail || team.userEmail}`}
              className="text-primary hover:underline"
            >
              {team.mail || team.userEmail || "No email available"}
            </a>
          </div>
          
          {team.phone && (
            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              <a
                href={`tel:${team.phone}`}
                className="text-primary hover:underline"
              >
                {team.phone}
              </a>
            </div>
          )}
          
          {team.userName && (
            <div className="flex items-center p-2 bg-blue-50 rounded-md">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="mr-2 h-5 w-5 text-blue-600"
              >
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
              <span className="text-blue-700">Facebook: <strong>@{team.userName}</strong></span>
            </div>
          )}
          
          {team.iqama && (
            <div className="flex items-center">
              <File className="mr-2 h-5 w-5 text-muted-foreground" />
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal hover:bg-transparent hover:underline text-primary"
                onClick={handleOpenIqama}
              >
                View Iqama Document
              </Button>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="py-4">
          <h3 className="mb-2 font-medium">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {team.eligible && team.eligible.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {skill}
              </span>
            ))}
            {(!team.eligible || team.eligible.length === 0) && (
              <span className="text-sm text-muted-foreground">No skills listed</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetail; 