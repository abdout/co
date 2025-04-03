'use client';

import { useState } from 'react';
import { useActionState } from '../kit/form';
import { deleteCar } from './actions';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteCarProps {
  id: string;
  name: string;
  onSuccess?: () => Promise<void>;
}

const DeleteCar = ({ id, name, onSuccess }: DeleteCarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { execute } = useActionState(deleteCar, {
    onSuccess: async () => {
      toast.success(`Car "${name}" deleted successfully`);
      setIsOpen(false);
      if (onSuccess) await onSuccess();
    },
    onError: (error) => {
      toast.error(error || 'Failed to delete car');
    },
    onComplete: () => {
      setIsLoading(false);
    }
  });

  const onConfirm = async () => {
    setIsLoading(true);
    await execute(id);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsOpen(true)}
      >
        Delete
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the car "{name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm} 
              disabled={isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteCar; 