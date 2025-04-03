import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewCardProps } from './type';
import { getCountryLabel, getLocalityLabel, getMonthLabel } from '@/utils/getArabicLabel';

export function PersonalInfoCard({ userData }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>المعلومات الشخصية</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">الاسم الكامل</p>
            <p>{userData?.fullname || 'غير محدد'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p>{userData?.email || 'غير محدد'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">رقم الهاتف</p>
            <p>{userData?.phone || 'غير محدد'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">واتساب</p>
            <p>{userData?.whatsapp || 'غير محدد'}</p>
          </div>
          
          {/* Birth Information */}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">مكان الميلاد</p>
            <p>
              {userData?.birthCountry && userData?.birthLocality 
                ? `${getCountryLabel(userData.birthCountry)} - ${getLocalityLabel(userData.birthLocality)}` 
                : userData?.birthCountry ? getCountryLabel(userData.birthCountry) 
                : userData?.birthLocality ? getLocalityLabel(userData.birthLocality) 
                : 'غير محدد'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">تاريخ الميلاد</p>
            <p>
              {userData?.birthMonth && userData?.birthYear 
                ? `${getMonthLabel(userData.birthMonth.toString())} ${userData.birthYear}` 
                : 'غير محدد'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 