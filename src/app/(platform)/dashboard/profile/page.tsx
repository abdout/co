import { auth } from "../../../../../auth";

import { notFound, redirect } from "next/navigation";
import { ProfileHeader } from "@/components/platform/profile/profile-header";
import { ProfileTabs } from "@/components/platform/profile/profile-tabs";
import { getUserById } from "@/components/auth/user";

export const metadata = {
  title: "الملف الشخصي",
  description: "عرض وتعديل الملف الشخصي الخاص بك",
};

export default async function ProfilePage() {
  // Get the current authenticated user
  const session = await auth();
  
  if (!session?.user) {
    // If not authenticated, redirect to login
    redirect("/auth/login");
  }
  
  // Get the current user's profile data
  const profileUser = await getUserById(session.user.id);
  
  if (!profileUser) {
    notFound();
  }

  // We know this is the user's own profile
  const isOwnProfile = true;

  return (
    <div className="w-full" dir="rtl">
      {/* Banner container - Twitter-like blue banner */}
      <div className="w-full h-48 bg-[#1DA1F2] relative">
        {/* Can be replaced with an actual banner image if available */}
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col">
          {/* Profile Header Section - positioned to overlap with banner */}
          <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />
          
          {/* Profile Tabs Section */}
          <ProfileTabs user={profileUser} />
        </div>
      </div>
    </div>
  );
} 