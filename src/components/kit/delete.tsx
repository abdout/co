'use client';

import { useState } from 'react';
import { deleteKit } from './actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteKitProps {
  id: string;
  name: string;
  onSuccess?: () => Promise<void>;
  onDelete?: () => void;
}

const DeleteKit = ({ id, name, onSuccess, onDelete }: DeleteKitProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteKit(id);
      
      if (result.success) {
        toast.success(`Kit "${name}" deleted successfully`);
        if (onSuccess) await onSuccess();
        if (onDelete) onDelete();
      } else if (result.message) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete kit');
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isConfirming ? (
        <motion.div
          initial={{ width: "32px", opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: "32px", opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={isLoading}
            className="h-8 px-3 rounded-full"
          >
            <span className="text-xs whitespace-nowrap mr-1">Are you sure?</span>
            <span className="font-bold">OK</span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleButtonClick}
            className="rounded-full h-8 w-8 p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteKit; 