import { currentUser } from "@/lib/auth";
import ActivityForm from "@/components/onboarding/eligibility/form";
import { Suspense } from "react";
import { db } from "@/lib/db";

async function getActivityData() {
  try {
    const user = await currentUser();
    if (!user?.id) {
      // Return a default structure if no user is found
      return { id: "", eligibility: [] };
    }

    // Find the user with their team relationship
    const userWithTeam = await db.user.findUnique({
      where: { id: user.id },
      include: { teams: true }
    });

    // If no team exists yet, return just the user ID
    if (!userWithTeam?.teams?.length) {
      return { id: user.id, eligibility: [] };
    }

    // Get the team data with eligibility
    const teamData = await db.team.findUnique({
      where: { id: userWithTeam.teams[0].id },
      select: {
        id: true,
        eligibility: true,
      }
    });

    // Return a response with user ID and the team's eligibility data
    return {
      id: user.id,
      teamId: teamData?.id,
      eligibility: teamData?.eligibility || [],
    };
  } catch (error) {
    console.error("Error fetching activity data:", error);
    // Return a safe default structure instead of potentially accessing null user
    return { id: "", eligibility: [] };
  }
}

export default async function ActivityPage() {
  const userData = await getActivityData();
  
  // Add a check to ensure we have valid user data
  if (!userData || !userData.id) {
    return (
      <div className="w-full flex items-center justify-center">
        <div>Please log in to continue</div>
      </div>
    );
  }
  
  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityForm user={userData} />
      </Suspense>
    </div>
  );
} 