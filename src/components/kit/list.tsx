'use client';
import { kit } from '@/constant/kit'
import React, { useState } from 'react'
import Profile from './profile';
import Car from './kit';
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from '@/components/ui/dialog';
import Kit from './kit';

const KitList = () => {
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const selectedKit = selectedKitId ? kit.find(k => k.id.toString() === selectedKitId) : undefined;
  
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedKitId(null);
    }
  };

  const handleSelectKit = (id: string) => {
    setSelectedKitId(id);
    setDialogOpen(true);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        {selectedKit && (
          <DialogContent className="max-w-[580px] p-0 border rounded-lg overflow-visible">
            <Profile kit={selectedKit} />
          </DialogContent>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 p-4">
          {kit.map((kitItem, index) => (
            <div key={index} onClick={() => handleSelectKit(kitItem.id.toString())}>
              <Kit 
                src={kitItem.src} 
                alt={kitItem.alt} 
                width={kitItem.width} 
                id={kitItem.id.toString()}
                bg={kitItem.bg}
                status={kitItem.status === "Available" ? 1 : 0}
                onSelect={handleSelectKit}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default KitList;