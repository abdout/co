'use client';

import TeamList from '@/components/team/list';
import TeamForm from '@/components/team/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { TeamMember } from '@/components/team/types';

interface TeamPageProps {
  initialTeams?: any[]; // Pass initial teams data from server component
}

export default function TeamPage({ initialTeams = [] }: TeamPageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Add a ref to the TeamList component to trigger refreshes
  const teamListRef = useRef<{ refreshMembers: () => Promise<void> } | null>(null);
  
  const handleCreateSuccess = async () => {
    setShowCreateForm(false);
    
    // Refresh the team members list
    if (teamListRef.current) {
      await teamListRef.current.refreshMembers();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>
      
      {/* Visual display of team members with ref to control refreshing */}
      <div>
        <TeamList 
          ref={teamListRef}
          showAddButton={false}
          initialTeams={initialTeams}
        />
      </div>
      
      {/* Create Form Dialog */}
      {showCreateForm && (
        <TeamForm 
          onSuccess={handleCreateSuccess}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
} 