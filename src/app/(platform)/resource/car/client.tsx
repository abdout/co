'use client';

import { useState, useRef } from 'react';
import CarList, { CarListRefType } from '@/components/car/list';
import CarForm from '@/components/car/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CarPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const carListRef = useRef<CarListRefType>(null);

  const handleCreateSuccess = async () => {
    setShowCreateForm(false);
    // Refresh the car list when a new car is added
    if (carListRef.current) {
      await carListRef.current.refreshCars();
    }
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">
            Cars
          </h1>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        </div>

        <CarList ref={carListRef} />

        {showCreateForm && (
          <CarForm
            onSuccess={handleCreateSuccess}
            onClose={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </div>
  );
} 