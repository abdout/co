'use client';
import { car } from '@/constant/car'
import React, { useState } from 'react'
import Profile from './profile';
import Car from './car';
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from '@/components/ui/dialog';

const CarList = () => {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const selectedCar = selectedCarId ? car.find(c => c.id === selectedCarId) : undefined;
  
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedCarId(null);
    }
  };

  const handleSelectCar = (id: string) => {
    setSelectedCarId(id);
    setDialogOpen(true);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        {selectedCar && (
          <DialogContent className="max-w-[580px] p-0 border rounded-lg overflow-visible">
            <Profile car={selectedCar} />
          </DialogContent>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 p-4">
          {car.map((carItem, index) => (
            <div key={index}>
              <Car 
                src={carItem.src} 
                alt={carItem.alt} 
                width={carItem.width} 
                id={carItem.id} 
               
                onSelect={handleSelectCar}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default CarList;