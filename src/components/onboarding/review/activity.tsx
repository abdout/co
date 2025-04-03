import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewCardProps } from './type';

// Helper function to format dates with Arabic month names
const formatDateWithArabicMonth = (date: Date): string => {
  const arabicMonths: Record<string, string> = {
    "1": "يناير", "2": "فبراير", "3": "مارس", "4": "أبريل",
    "5": "مايو", "6": "يونيو", "7": "يوليو", "8": "أغسطس",
    "9": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر"
  };
  
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${arabicMonths[month.toString()]} ${year}`;
};

export function ActivitiesCard({ userData }: ReviewCardProps) {
  // Parse activities from JSON string
  const activities = userData?.activitiesData 
    ? JSON.parse(userData.activitiesData) 
    : [];
    
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>الأنشطة والمهارات</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Systems and Activities */}
        {userData?.systemsData && userData.systemsData.length > 0 && (
          <div className="pb-6">
            <p className="text-sm text-gray-500 mb-3">الأنظمة الفنية</p>
            <div className="space-y-4">
              {userData.systemsData.map((system, index) => (
                <div key={index} className="border-r-4 border-primary pr-4 py-2">
                  <p className="text-md font-medium">{system}</p>
                  
                  {/* List activities for this system */}
                  <div className="mt-2 pl-4">
                    {activities
                      .filter((act: any) => act.system === system)
                      .map((act: any, actIndex: number) => (
                        <div key={actIndex} className="text-sm py-1">
                          <span className="text-muted-foreground">{act.category} / {act.subcategory}:</span> {act.activity}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className='flex flex-col md:flex-row space-x-14 pb-6 -ml-10'>
          {/* Skills */}
          {userData?.skills && userData.skills.length > 0 && (
            <div className="w-full md:w-1/2 pl-4 ">
              <p className="text-sm text-gray-500">المهارات</p>
              <div className="flex flex-wrap gap-2 mt-2 ">
                {userData.skills.map((skill, index) => (
                  <span key={index} className="md:px-2 py-1 bg-neutral-100 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Interests */}
          {userData?.interests && userData.interests.length > 0 && (
            <div className="w-full md:w-1/2 ">
              <p className="text-sm text-gray-500 pt-3 md:pt-0">الاهتمامات</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 