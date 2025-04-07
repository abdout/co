'use client';

import { useEffect, useState } from 'react';
import { useActionState } from '@/lib/hooks/useActionState';
import { getTeamMembers } from './actions';
import { TeamMember } from './types';
import TeamForm from './form';
import DeleteTeamMember from './delete';
import TeamCard from './card';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const TeamContent = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, memberId: string | null }>({ x: 0, y: 0, memberId: null });

  const { execute: fetchMembers } = useActionState(getTeamMembers, {
    onError: (error) => toast.error(error)
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        const result = await fetchMembers();
        setMembers(result || []);
      } catch (error) {
        toast.error('Failed to fetch team members');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMembers();
  }, [fetchMembers]);

  const handleRightClick = (e: React.MouseEvent, memberId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, memberId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ x: 0, y: 0, memberId: null });
  };

  const handleOpenDialog = (memberId: string) => {
    setEditingMemberId(memberId);
    setIsCreateDialogOpen(true);
    handleCloseContextMenu();
  };

  const handleMemberCreated = async () => {
    setIsLoading(true);
    await fetchMembers();
    setIsCreateDialogOpen(false);
    setEditingMemberId(null);
  };

  const handleMemberDeleted = async () => {
    setIsLoading(true);
    await fetchMembers();
  };

  const memberToEdit = editingMemberId ? members.find(m => m.id === editingMemberId) || null : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            onClick={() => handleOpenDialog(member.id)}
            onRightClick={(e) => handleRightClick(e, member.id)}
            contextMenu={contextMenu}
            onCloseContextMenu={handleCloseContextMenu}
            onMemberDeleted={handleMemberDeleted}
          />
        ))}

        <div className="h-48">
          <button
            className="w-full h-full p-6 border rounded-xl flex flex-col items-center justify-center hover:border-black opacity-70 hover:opacity-100"
            onClick={() => {
              setEditingMemberId(null);
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="h-10 w-10 opacity-70" />
          </button>
        </div>
      </div>

      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingMemberId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <VisuallyHidden>
            <DialogTitle>{editingMemberId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </VisuallyHidden>
          <TeamForm 
            memberToEdit={memberToEdit}
            onSuccess={handleMemberCreated}
            onClose={() => {
              setIsCreateDialogOpen(false);
              setEditingMemberId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamContent; 