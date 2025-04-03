'use client';

import { useState } from 'react';
import { useActionState } from '../kit/form';
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
  const [deleteState, executeDelete] = useActionState(deleteTeamMember);

  const isLoading = deleteState.pending;

  const onConfirm = async () => {
    try {
      await executeDelete(id);
      toast.success(`Team member "${name}" deleted successfully`);
      if (onSuccess) await onSuccess();
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  return (
    <AlertDialog>
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
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamMember; 