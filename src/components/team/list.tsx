'use client';

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { useActionState } from '@/lib/hooks/useActionState';
import { getTeamMembers } from './actions';
import { TeamMember } from './types';
import TeamCard from './card';
import TeamDetail from './detail';
import TeamForm from './form';
import { toast } from 'sonner';
import {
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';

interface TeamListProps {
  onSelect?: (member: TeamMember) => void;
  showAddButton?: boolean;
  onAddSuccess?: () => Promise<void>;
  initialTeams?: any[]; // Add prop for initial data from server component
}

// Define the ref type
export type TeamListRefType = {
  refreshMembers: () => Promise<void>;
};

// Convert TeamList to use forwardRef
const TeamList = forwardRef<TeamListRefType, TeamListProps>(
  ({ onSelect, showAddButton = false, onAddSuccess, initialTeams = [] }, ref) => {
    const [members, setMembers] = useState<TeamMember[]>(() => {
      // Map initial data from server to TeamMember format
      if (initialTeams && initialTeams.length > 0) {
        console.log('Using initial data from server component:', initialTeams.length);
        return initialTeams.map(team => {
          // Extract user data if available
          const userData = (team as any).userData || {};
          
          return {
            id: team.id,
            firstName: team.fullname?.split(' ')[0] || '',
            lastName: team.fullname?.split(' ')[1] || '',
            src: team.src || '',
            alt: team.alt || team.fullname || '',
            phone: team.phone || '',
            mail: team.mail || userData.email || '',
            location: team.location || '',
            width: team.width || 105,
            height: team.height || 105,
            iqama: team.iqama || '',
            eligible: team.eligibility || [],
            // Add user related data
            userName: userData.username || '',
            userEmail: userData.email || '',
            userImage: userData.image || '',
          };
        });
      }
      return [];
    });
    const [isLoading, setIsLoading] = useState(initialTeams.length === 0);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    
    const { execute: fetchMembers } = useActionState(getTeamMembers, {
      onError: (error) => toast.error(error)
    });

    // Fetch members function that can be called from outside
    const refreshMembers = useCallback(async () => {
      try {
        setIsLoading(true);
        console.log('TeamList: Fetching team members...');
        const result = await fetchMembers();
        console.log(`TeamList: Fetch completed, received ${result?.length || 0} members`);
        
        // The execute function returns the data directly
        if (Array.isArray(result)) {
          setMembers(result);
        } else {
          console.warn('TeamList: Received non-array result:', result);
          setMembers([]);
        }
      } catch (error) {
        console.error('TeamList: Error fetching team members:', error);
        toast.error('Failed to fetch team members');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    }, [fetchMembers]);

    // Expose the refreshMembers method through the ref
    useImperativeHandle(ref, () => ({
      refreshMembers
    }));

    // Load members when component mounts if no initial data
    useEffect(() => {
      if (initialTeams.length === 0) {
        console.log('No initial teams provided, fetching from server');
        refreshMembers();
      } else {
        console.log('Using initial data, skipping server fetch');
      }
    }, [refreshMembers, initialTeams.length]);

    const handleMemberClick = (member: TeamMember) => {
      if (onSelect) {
        onSelect(member);
      } else {
        setSelectedMember(member);
        setDialogOpen(true);
      }
    };

    const handleOpenChange = (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setSelectedMember(null);
      }
    };

    const handleAddMember = () => {
      setIsAdding(true);
    };

    const handleAddSuccess = async () => {
      setIsAdding(false);
      await refreshMembers();
      if (onAddSuccess) await onAddSuccess();
    };

    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-[500px] p-0 border rounded-lg">
            {selectedMember && <TeamDetail team={selectedMember} onClose={() => setDialogOpen(false)} />}
          </DialogContent>
        </Dialog>

        {isAdding && (
          <TeamForm
            onSuccess={handleAddSuccess}
            onClose={() => setIsAdding(false)}
          />
        )}

        <div className="p-4">
          {showAddButton && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddMember}
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                Add Team Member
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[240px] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="mb-2">No team members found.</p>
              {showAddButton && (
                <button
                  onClick={handleAddMember}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  Add your first team member
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  onClick={() => handleMemberClick(member)}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
);

// Add display name for better debugging
TeamList.displayName = 'TeamList';

export default TeamList;