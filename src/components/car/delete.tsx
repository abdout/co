'use client';

import { useState } from 'react';
import { deleteCar } from './actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface DeleteCarProps {
  id: string;
  name: string;
  onSuccess?: () => Promise<void>;
  onDelete?: () => void;
}

const DeleteCar = ({ id, name, onSuccess, onDelete }: DeleteCarProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteCar(id);
      
      if (result.success) {
        toast.success(`Car "${name}" deleted successfully`);
        if (onSuccess) await onSuccess();
        if (onDelete) onDelete();
      } else if (result.message) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete car');
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
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteCar; 