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
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>الأنشطة والانتماءات</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
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
              <div className="flex gap-2 mt-2">
                {userData.interests.map((interest, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Political Party */}
          {userData?.partyMember && (
            <div className="border-r-4 border-primary pr-4 py-2">
              <p className="text-md">
                عضو في {userData.partyName ? `حزب ${userData.partyName}` : 'حزب سياسي'}
                {(userData?.partyStartDate || userData?.partyEndDate) && ' في الفترة من '}
                {userData.partyStartDate ? formatDateWithArabicMonth(new Date(userData.partyStartDate)) : ''}
                {userData.partyEndDate ? ` إلى ${formatDateWithArabicMonth(new Date(userData.partyEndDate))}` : userData.partyStartDate ? ' حتى الآن' : ''}
              </p>
            </div>
          )}
          
          {/* Union */}
          {userData?.unionMember && (
            <div className="border-r-4 border-primary pr-4 py-2">
              <p className="text-md">
                عضو في {userData.unionName ? `نقابة ${userData.unionName}` : 'نقابة'}
                {(userData?.unionStartDate || userData?.unionEndDate) && ' في الفترة من '}
                {userData.unionStartDate ? formatDateWithArabicMonth(new Date(userData.unionStartDate)) : ''}
                {userData.unionEndDate ? ` إلى ${formatDateWithArabicMonth(new Date(userData.unionEndDate))}` : userData.unionStartDate ? ' حتى الآن' : ''}
              </p>
            </div>
          )}
          
          {/* NGO */}
          {userData?.ngoMember && (
            <div className="border-r-4 border-primary pr-4 py-2">
              <p className="text-md">
                عضو في {userData.ngoName ? `منظمة ${userData.ngoName}` : 'منظمة غير حكومية'}
                {userData?.ngoActivity ? ` (${userData.ngoActivity})` : ''}
              </p>
            </div>
          )}
          
          {/* Club */}
          {userData?.clubMember && (
            <div className="border-r-4 border-primary pr-4 py-2">
              <p className="text-md">
                عضو في {userData.clubName ? `نادي ${userData.clubName}` : 'نادي'}
                {userData?.clubType ? ` (${userData.clubType})` : ''}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 