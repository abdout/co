import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from '@iconify/react';

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
  };
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  // Generate a Twitter-like username from name or email
  const username = user.name ? 
    `@${user.name.toLowerCase().replace(/\s+/g, '')}` : 
    `@user${user.id.slice(0, 5)}`;

  return (
    <div className="w-full pb-4 relative mt-[-50px]">
      {/* Avatar - positioned to overlap with banner for RTL layout */}
      <div className="px-4">
        <Image
          src={user.image || "/placeholder-avatar.jpg"}
          alt={user.name || "User profile"}
          width={130}
          height={130}
          className="rounded-full object-cover border-4 border-background absolute right-4 top-[-15px]"
        />
        
        {/* Edit Profile Button - Twitter style position for RTL */}
        {isOwnProfile && (
          <div className="flex justify-end mt-20">
            <Link 
              href="/platform/profile/edit"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full border-2 font-bold"
              )}
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        )}
      </div>

      {/* Profile Info - with Twitter-like spacing and layout */}
      <div className="px-4 pt-16 mt-4">
        <h1 className="text-xl font-bold">
          {user.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {username}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          {user.email}
        </p>

        {/* Bio section - Twitter has this */}
        <p className="mt-4 text-gray-800">
          {/* Placeholder for bio */}
          مطور ومصمم تطبيقات ويب وموبايل
        </p>

        {/* Twitter-like stats */}
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800">120</span> متابَع
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800">230</span> متابِع
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4">
          {user.facebook && (
            <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2]">
              <Icon icon="bi:facebook" width={20} height={20} />
            </a>
          )}
          {user.twitter && (
            <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2]">
              <Icon icon="akar-icons:twitter-fill" width={20} height={20} />
            </a>
          )}
          {user.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2]">
              <Icon icon="akar-icons:linkedin-fill" width={20} height={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 