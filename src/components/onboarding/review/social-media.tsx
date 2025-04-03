import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';
import { ReviewCardProps } from './type';

export function SocialMediaCard({ userData }: ReviewCardProps) {
  // Check if there's at least one social media link
  const hasSocialMedia = userData?.twitter || userData?.facebook || 
                          userData?.linkedin || userData?.telegram || 
                          userData?.instagram || userData?.tiktok;
  
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>التواصل الاجتماعي</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {hasSocialMedia ? (
          <div className="flex flex-wrap gap-4">
            {userData?.twitter && (
              <Link 
                href={userData.twitter.startsWith('http') ? userData.twitter : `https://twitter.com/${userData.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity"
              >
                <FaTwitter size={32} className="text-gray-700" />
              </Link>
            )}
            {userData?.facebook && (
              <Link 
                href={userData.facebook.startsWith('http') ? userData.facebook : `https://facebook.com/${userData.facebook}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <FaFacebook size={32} className="text-gray-700" />
              </Link>
            )}
            {userData?.linkedin && (
              <Link 
                href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <FaLinkedin size={32} className="text-gray-700" />
              </Link>
            )}
            {userData?.telegram && (
              <Link 
                href={userData.telegram.startsWith('http') ? userData.telegram : `https://t.me/${userData.telegram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <FaTelegram size={32} className="text-gray-700" />
              </Link>
            )}
            {userData?.instagram && (
              <Link 
                href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <FaInstagram size={32} className="text-gray-700" />
              </Link>
            )}
            {userData?.tiktok && (
              <Link 
                href={userData.tiktok.startsWith('http') ? userData.tiktok : `https://tiktok.com/@${userData.tiktok.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <FaTiktok size={32} className="text-gray-700" />
              </Link>
            )}
          </div>
        ) : (
          <p className="text-gray-500">لا توجد بيانات</p>
        )}
      </CardContent>
    </Card>
  );
} 