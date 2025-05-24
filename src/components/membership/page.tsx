// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import LabUserList from "./all";
// import { Head } from "next/document";
// import SiteHeading from "@/components/atom/site-heading";

// export default async function LabPage() {
//   const session = await auth();
//   const currentUserId = session?.user?.id;

//   // Fetch all users from the database, including onboardingStatus and applicationStatus
//   const users = await db.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       image: true,
//       bio: true,
//       currentCountry: true,
//       currentLocality: true,
//       onboardingStatus: true,
//       applicationStatus: true,
//       role: true,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return (
//     <div className="container">
//       <SiteHeading title="العضوية" description="ادارة الطلبات والتصاريح" align="start"/>
//       <LabUserList users={users} currentUserId={currentUserId ?? ""} />
//     </div>
//   );
// }
