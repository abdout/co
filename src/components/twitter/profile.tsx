import Image from "next/image"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAttachment } from "@/components/onboarding/attachment/action"
import Link from "next/link"
import { getInformation } from "./edit/information/action"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import About, { AboutUserData } from "./about"
import Contribute from "./contribute"
import Issue from "./issue"
import { fetchUserForReview } from "@/components/onboarding/review/action"
import { getLocalityLabel } from '@/utils/getArabicLabel'

// Utility to extract main domain name from a URL
function extractDomainName(url: string): string {
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const { hostname } = new URL(normalizedUrl);
    return hostname.replace(/^www\./, '').split('.')[0];
  } catch {
    return url;
  }
}

export default async function TwitterProfile() {
  const attachment = await getAttachment();
  const image = attachment?.image || "/placeholder.svg?height=128&width=128";
  const cover = attachment?.cover || null;

  const { data: userData } = await fetchUserForReview();
  const name = userData?.name || "غير معروف";
  const occupation = userData?.currentOccupation || "غير معروف";

  

  return (
    <div className="md:max-w-2xl md:mx-20 overflow-hidden">
      {/* Banner */}
      <div className="relative md:h-48 h-32 w-full bg-yellow-400">
        {cover && (
          <Image
            src={cover}
            alt="Cover image"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            quality={100}
          />
        )}
      </div>

      {/* Profile Section */}
      <div className="md:px-5 px-3">
        {/* Profile Picture and Edit Button */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-12 md:-mt-16 md:h-32 md:w-32 h-24 w-24 overflow-hidden">
            <div className="relative h-full w-full md:border-4 border-[3px] border-background rounded-full overflow-hidden">
              <Image
                src={image}
                alt="Profile picture"
                fill
                sizes="128px"
                className="object-cover bg-[#f8f3e3]"
                quality={100}
              />
            </div>
          </div>
          <Link href="/dashboard/profile/edit">
            <Button variant="outline" size='sm' className="md:mt-4 mt-3 rounded-full border border-primary">
              تعديل
            </Button>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="md:mt-3 mt-2 space-y-1 md:pr-2">
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-[#5b7083]">@abdout</p>
          <p className="py-2">{occupation}</p>

          <div className="flex flex-wrap gap-x-4 text-[#5b7083] text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {userData?.currentLocality ? (
                <span>{getLocalityLabel(userData.currentLocality).replace('محلية ', '')}</span>
              ) : (
                <span>غير محدد</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {userData?.link && (
                <Link
                  href={userData.link.startsWith('http') ? userData.link : `https://${userData.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#5b7083] hover:text-blue-700 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 256 256"><path fill="currentColor" d="M117.18 188.74a12 12 0 0 1 0 17l-5.12 5.12A58.26 58.26 0 0 1 70.6 228a58.62 58.62 0 0 1-41.46-100.08l34.75-34.75a58.64 58.64 0 0 1 98.56 28.11a12 12 0 1 1-23.37 5.44a34.65 34.65 0 0 0-58.22-16.58l-34.75 34.75A34.62 34.62 0 0 0 70.57 204a34.4 34.4 0 0 0 24.49-10.14l5.11-5.12a12 12 0 0 1 17.01 0M226.83 45.17a58.65 58.65 0 0 0-82.93 0l-5.11 5.11a12 12 0 0 0 17 17l5.12-5.12a34.63 34.63 0 1 1 49 49l-34.81 34.7A34.4 34.4 0 0 1 150.61 156a34.63 34.63 0 0 1-33.69-26.72a12 12 0 0 0-23.38 5.44A58.64 58.64 0 0 0 150.56 180h.05a58.28 58.28 0 0 0 41.47-17.17l34.75-34.75a58.62 58.62 0 0 0 0-82.91" stroke-width="1" stroke="currentColor"/></svg>
                  <span>{extractDomainName(userData.link)}</span>
                </Link>
              )}
            </div>
          </div>

          {/* <div className="flex gap-5 py-3">
            <div className="flex gap-1">
              <span className="font-bold text-[#0f1419]">569</span>
              <span className="text-[#5b7083]">Following</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-[#0f1419]">72</span>
              <span className="text-[#5b7083]">Followers</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-3 relative">
        <Tabs dir="rtl" defaultValue="about" className="-mx-3 md:mx-1">
          <div className="relative">
            <TabsList className="flex w-full h-auto bg-transparent border-0 p-0 shadow-none relative z-10">
              <TabsTrigger 
                value="about"
                className="flex-1 py-3 px-0 text-center rounded-none border-0 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:bg-transparent text-[#5b7083] hover:text-foreground transition-colors font-medium"
              >
                حول
              </TabsTrigger>
              <TabsTrigger 
                value="contribute"
                className="flex-1 py-3 px-0 text-center rounded-none border-0 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:bg-transparent text-[#5b7083] hover:text-foreground  transition-colors font-medium"
              >
                سهم
              </TabsTrigger>
              <TabsTrigger 
                value="issue"
                className="flex-1 py-3 px-0 text-center rounded-none border-0 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:bg-transparent text-[#5b7083] hover:text-foreground transition-colors font-medium"
              >
                مشكلة
              </TabsTrigger>
              <TabsTrigger 
                value="likes"
                className="flex-1 py-3 px-0 text-center rounded-none border-0 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:bg-transparent text-[#5b7083] hover:text-foreground transition-colors font-medium"
              >
                ثريد
              </TabsTrigger>
            </TabsList>
            
            {/* Full width divider line positioned at the bottom of tabs */}
            <div className="h-[1px] bg-border w-screen absolute bottom-0 left-1/2 right-1/2 -mx-[50vw]"></div>
          </div>
          
          <TabsContent value="about" className="">
            <About userData={userData as AboutUserData} />
          </TabsContent>
          
          <TabsContent value="contribute">
            <Contribute />
          </TabsContent>
          
          <TabsContent value="issue">
            <Issue />
          </TabsContent>
          
          <TabsContent value="likes" className="mt-6 text-center text-muted-foreground py-8">
            لا توجد ثريد حتى الآن
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
