'use client';

import { useState, useEffect } from 'react';
import { useActionState } from '../kit/form';
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
}

const TeamList = ({ onSelect, showAddButton = false, onAddSuccess }: TeamListProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [fetchState, fetchMembers] = useActionState(getTeamMembers, {
    optimisticData: [] as TeamMember[]
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        const result = await fetchMembers();
        if (result) {
          setMembers(result);
        }
      } catch (error) {
        toast.error('Failed to fetch team members');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMembers();
  }, [fetchMembers]);

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
    setIsLoading(true);
    await fetchMembers();
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
};

export default TeamList;