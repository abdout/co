import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileAbout } from './profile-about';
import { ProfileEducation } from './profile-education';
import { ProfileSkills } from './profile-skills';
import { ProfileActivities } from './profile-activities';

interface ProfileTabsProps {
  user: any; // Using any here for simplicity, in a real app would define a proper interface
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full mt-4">
      <div className="border-b border-gray-200">
        <TabsList className="flex w-full justify-end gap-2 bg-transparent">
          <TabsTrigger 
            value="about" 
            className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#1DA1F2] data-[state=active]:shadow-none rounded-none py-3 px-6 text-gray-600 data-[state=active]:text-[#1DA1F2] data-[state=active]:font-bold"
          >
            نبذة
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#1DA1F2] data-[state=active]:shadow-none rounded-none py-3 px-6 text-gray-600 data-[state=active]:text-[#1DA1F2] data-[state=active]:font-bold"
          >
            التعليم
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#1DA1F2] data-[state=active]:shadow-none rounded-none py-3 px-6 text-gray-600 data-[state=active]:text-[#1DA1F2] data-[state=active]:font-bold"
          >
            المهارات
          </TabsTrigger>
          <TabsTrigger 
            value="activities" 
            className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#1DA1F2] data-[state=active]:shadow-none rounded-none py-3 px-6 text-gray-600 data-[state=active]:text-[#1DA1F2] data-[state=active]:font-bold"
          >
            النشاطات
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Tab contents with Twitter-like styling */}
      <TabsContent value="about" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileAbout user={user} />
      </TabsContent>
      
      <TabsContent value="education" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileEducation user={user} />
      </TabsContent>
      
      <TabsContent value="skills" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileSkills user={user} />
      </TabsContent>
      
      <TabsContent value="activities" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileActivities user={user} />
      </TabsContent>
    </Tabs>
  );
} 