'use client';

import KitList from '@/components/kit/list';
import KitForm from '@/components/kit/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useRef } from 'react';

export default function KitPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Add a ref to the KitList component to trigger refreshes
  const kitListRef = useRef<{ refreshKits: () => Promise<void> } | null>(null);
  
  const handleCreateSuccess = async () => {
    setShowCreateForm(false);
    
    // Refresh the kits list
    if (kitListRef.current) {
      await kitListRef.current.refreshKits();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Equipment Kits</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Kit
        </Button>
      </div>
      
      {/* Visual display of kits with ref to control refreshing */}
      <div>
        <KitList ref={kitListRef} />
      </div>
      
      {/* Create Form Dialog */}
      {showCreateForm && (
        <KitForm 
          onSuccess={handleCreateSuccess}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
} 