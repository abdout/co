'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getTeamMemberById, deleteTeamMember } from "@/components/team/actions";
import { TeamMember } from "@/components/team/types";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadTeamMember() {
      setLoading(true);
      
      if (params.id) {
        try {
          const result = await getTeamMemberById(params.id as string);
          
          if (result) {
            setMember(result);
          } else {
            toast.error("Team member not found");
          }
        } catch (error) {
          console.error("Failed to load team member:", error);
          toast.error("Failed to load team member details");
        }
      }
      
      // Short timeout to ensure a smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    loadTeamMember();
  }, [params.id]);

  const handleEditClick = () => {
    router.push(`/resource/team/edit/${params.id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!member) return;
    
    setIsDeleting(true);
    try {
      await deleteTeamMember(member.id);
      toast.success("Team member deleted successfully");
      router.push("/resource/team");
    } catch (error) {
      console.error("Failed to delete team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
          <p>Loading team member details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container py-10 min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Team member not found</h1>
          <p className="mb-6">The team member you are looking for does not exist or has been removed.</p>
          <Link href="/resource/team" className="text-primary hover:underline">
            Return to team management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column with image and key info */}
        <div className="md:col-span-1">
          <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-white">
              {member.src || member.userImage ? (
                <img
                  src={member.src || member.userImage}
                  alt={member.alt || `${member.firstName} ${member.lastName}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </AspectRatio>
          </div>
          
          <div className="mb-6">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg mt-2">
                {member.location && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Location</span>
                    <span>{member.location}</span>
                  </div>
                )}
                
                {member.phone && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Phone</span>
                    <span>{member.phone}</span>
                  </div>
                )}
                
                {(member.mail || member.userEmail) && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Email</span>
                    <span>{member.mail || member.userEmail}</span>
                  </div>
                )}

                {member.userName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Facebook Username</span>
                    <span className="text-blue-600 font-medium">@{member.userName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-6">
            <Button 
              variant="default"
              size="sm"
              onClick={handleEditClick}
              className="rounded-full h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Button>
            
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDeleteClick}
              className="rounded-full h-8 w-8 p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Right column with detailed info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-1">{member.firstName} {member.lastName}</h1>
          <p className="text-gray-500 mb-6">ID: {member.id}</p>
          
          {member.iqama && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Iqama</h3>
              <p className="text-gray-700">{member.iqama}</p>
            </div>
          )}
          
          {member.eligible && member.eligible.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Eligibility</h3>
              <div className="flex flex-wrap gap-2">
                {member.eligible.map((item, index) => (
                  <Badge key={index} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* User Account Information */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-3">
              {member.userName ? 'Facebook Account' : 'User Account'}
            </h3>
            <div className="grid gap-3">
              {member.userName && (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                  <span className="font-medium">Username</span>
                  <span className="text-blue-600 font-medium">@{member.userName}</span>
                </div>
              )}
              
              {member.userEmail && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <span className="font-medium">Email</span>
                  <span>{member.userEmail}</span>
                </div>
              )}
              
              {!member.userName && !member.userEmail && (
                <div className="text-muted-foreground text-sm">No user account information available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Delete Team Member</DialogTitle>
          <DialogClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          
          <div className="py-4">
            <p className="mb-4">Are you sure you want to delete {member?.firstName} {member?.lastName}? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
