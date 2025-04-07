'use client';
import React from "react";
import { Mail } from "lucide-react";
import { Icon } from "@iconify/react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TeamMember {
  src: string;
  alt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mail?: string;
  location?: string;
  width?: number;
  height?: number;
  id?: string;
  iqama?: string;
  eligible?: string[];
}

interface TeamCardProps {
  member: TeamMember;
  onClick?: () => void;
}

const TeamCard = ({ member, onClick }: TeamCardProps) => {
  // Determine role based on expertise - if they have eligible skills list, they're likely engineers
  const isEngineer = member.eligible && member.eligible.length > 0;
  const firstName = member.firstName || member.alt.split(' ')[0];
  const lastName = member.lastName || member.alt.split(' ')[1] || '';
  const fullName = `${firstName} ${lastName}`;
  const role = isEngineer ? "Engineer" : "Technician";
  
  return (
    <Card className="border border-gray-200 rounded-md overflow-hidden flex flex-col items-center py-5 px-2 shadow-none max-w-[220px]" onClick={onClick}>
      <div className="flex justify-center mb-3 w-[90px] h-[90px] relative">
        <img
          className="rounded-full object-cover absolute inset-0 w-full h-full"
          src={member.src || "/placeholder-avatar.jpg"}
          alt={fullName}
          loading="lazy"
        />
      </div>
      
      <CardContent className="text-center p-0 mb-3 w-full">
        <h3 className="text-base font-medium text-gray-800 mb-1">{fullName}</h3>
        <p className="text-xs text-gray-500">
          {role}
          {member.location ? ` • ${member.location}` : ''}
        </p>
      </CardContent>

      <CardFooter className="p-0 w-full flex justify-center gap-2">
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            if (member.mail) window.location.href = `mailto:${member.mail}`;
          }}
        >
          <Mail size={18} />
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            if (member.phone) window.location.href = `https://wa.me/${member.phone.replace(/\s+/g, '')}`;
          }}
        >
          <Icon icon="ri:whatsapp-line" width={18} height={18} />
        </button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;