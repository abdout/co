import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewCardProps } from './type';

export function AttachmentsCard({ teamData }: ReviewCardProps) {
  // Check if there are any attachments
  const hasAttachments = teamData?.image || teamData?.resume || 
                         teamData?.iqama || teamData?.passport ||
                         teamData?.drivingLicense || teamData?.sce;
  
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {hasAttachments ? (
          <div className="space-y-4">
            {teamData?.image && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={teamData.image} 
                    alt="Profile Picture" 
                    width={40} 
                    height={40} 
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <span className="text-sm">Profile Picture</span>
              </div>
            )}
            {teamData?.resume && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">Resume</span>
              </div>
            )}
            {teamData?.iqama && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">Iqama</span>
              </div>
            )}
            {teamData?.passport && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">Passport</span>
              </div>
            )}
            {teamData?.drivingLicense && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">Driving License</span>
              </div>
            )}
            {teamData?.sce && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">SCE</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No attachments</p>
        )}
      </CardContent>
    </Card>
  );
} 