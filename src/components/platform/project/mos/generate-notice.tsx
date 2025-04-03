'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface GenerateNoticeProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const GenerateNotice: React.FC<GenerateNoticeProps> = ({ onGenerate, isGenerating }) => {
  const { toast } = useToast();

  const handleGenerateClick = () => {
    toast({
      title: 'Generating MOS content',
      description: 'This may take a moment...',
    });
    onGenerate();
  };

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing MOS Content</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          Method of Statement content needs to be generated for the activities in this project.
        </span>
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating}
          size="sm"
          className="ml-2"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GenerateNotice; 