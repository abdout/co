import { currentUser } from "@/lib/auth";
import ActivityForm from "@/components/onboarding/eligibility/form";
import { Suspense } from "react";
import { db } from "@/lib/db";

async function getActivityData() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        systemsData: true,
        activitiesData: true,
        
      }
    });

    return userData;
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return null;
  }
}

export default async function ActivityPage() {
  const userData = await getActivityData();
  
  if (!userData) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityForm user={userData} />
      </Suspense>
    </div>
  );
} 