'use client';

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import TeamDetail from "./detail";
import { TeamMember, TeamCardProps } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DeleteTeamMember from "./delete";

const TeamCard = ({ 
  member, 
  onClick, 
  onRightClick,
  contextMenu,
  onCloseContextMenu,
  onMemberDeleted 
}: TeamCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle closing context menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu?.memberId && !cardRef.current?.contains(event.target as Node)) {
        onCloseContextMenu && onCloseContextMenu();
      }
    };

    if (contextMenu?.memberId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu, onCloseContextMenu]);

  const isContextMenuOpen = contextMenu?.memberId === member.id;

  return (
    <div 
      ref={cardRef}
      className="group relative overflow-hidden rounded-lg bg-background border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick && onClick(member)}
      onContextMenu={(e) => onRightClick && onRightClick(e, member.id)}
    >
      <div className="flex flex-col items-center p-6">
        <div className="relative mb-4">
          <div className="relative h-[105px] w-[105px] rounded-full overflow-hidden bg-muted">
            <img
              src={member.src || member.userImage || "/placeholder-avatar.jpg"}
              alt={member.alt || `${member.firstName} ${member.lastName}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className={cn(
            "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
            member.location === "In RTCC" ? "bg-green-500" : "bg-yellow-500"
          )} />
        </div>
        
        <h3 className="text-lg font-semibold">
          {member.firstName} {member.lastName}
        </h3>
        
        {/* Display the Facebook username if available */}
        {member.userName && (
          <div className="mt-1 text-xs text-blue-500 font-medium">
            @{member.userName}
          </div>
        )}
        
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span>{member.location}</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1 justify-center">
          {member.eligible && member.eligible.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {skill}
            </span>
          ))}
          {member.eligible && member.eligible.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
              +{member.eligible.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex w-full justify-around text-muted-foreground">
          {member.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4" />
            </div>
          )}
          {(member.mail || member.userEmail) && (
            <div className="flex items-center">
              <Mail className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Context Menu Button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(member);
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div onClick={(e) => e.stopPropagation()}>
                <DeleteTeamMember 
                  id={member.id} 
                  name={`${member.firstName} ${member.lastName}`} 
                  onSuccess={onMemberDeleted}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Native Context Menu */}
      {isContextMenuOpen && (
        <div 
          className="fixed bg-background shadow-md rounded-md py-1 border z-50"
          style={{ 
            top: contextMenu.y, 
            left: contextMenu.x 
          }}
        >
          <div 
            className="px-3 py-2 hover:bg-accent cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(member);
              onCloseContextMenu && onCloseContextMenu();
            }}
          >
            Edit
          </div>
          <div className="px-3 py-2 hover:bg-accent cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <DeleteTeamMember 
              id={member.id} 
              name={`${member.firstName} ${member.lastName}`} 
              onSuccess={() => {
                onMemberDeleted && onMemberDeleted();
                onCloseContextMenu && onCloseContextMenu();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard; 