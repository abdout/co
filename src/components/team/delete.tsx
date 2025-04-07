'use client';

import { useState } from 'react';
import { useActionState } from '@/lib/hooks/useActionState';
import { deleteTeamMember } from './actions';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteTeamMemberProps {
  id: string;
  name: string;
  onSuccess?: () => Promise<void>;
}

const DeleteTeamMember = ({ id, name, onSuccess }: DeleteTeamMemberProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { execute: executeDelete, isLoading: isDeleting } = useActionState(deleteTeamMember, {
    onSuccess: () => {
      setIsOpen(false);
      toast.success('Team member deleted successfully');
      if (onSuccess) onSuccess();
    },
    onError: (error) => toast.error(error || 'Failed to delete team member')
  });

  const onConfirm = async () => {
    try {
      await executeDelete(id);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full text-left text-destructive">Delete</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the team member "{name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamMember; 