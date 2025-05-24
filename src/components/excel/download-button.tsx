'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateMembershipExcel } from './actions';

export function DownloadBackup() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Call server action
      const result = await generateMembershipExcel();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Download failed');
      }
      
      // Convert base64 to blob
      const byteCharacters = atob(result.data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || `membership_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download backup: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      {isLoading ? 'Downloading...' : 'Download Membership Data'}
    </Button>
  );
} 