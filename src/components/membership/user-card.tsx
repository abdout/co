// 'use client';

// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { approveApplication } from "@/components/onboarding/review/action";

// interface User {
//   id: string;
//   name: string | null;
//   email: string | null;
//   image: string | null;
//   bio: string | null;
//   currentCountry: string | null;
//   currentLocality: string | null;
//   onboardingStatus?: string | null;
//   applicationStatus?: string | null;
//   role?: string | null;
// }

// interface UserCardProps {
//   user: User;
//   isCurrentUser: boolean;
//   onStatusChange?: (userId: string, newStatus: string) => void;
// }

// export function UserCard({ user, isCurrentUser, onStatusChange }: UserCardProps) {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Extract initials from user name for avatar fallback
//   const initials = user.name
//     ? user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//         .substring(0, 2)
//     : "??";

//   const handleApprove = () => {
//     setError(null);
//     startTransition(async () => {
//       const result = await approveApplication(user.id);
//       if (result.success && onStatusChange) {
//         onStatusChange(user.id, "APPROVED");
//       } else if (!result.success) {
//         setError(result.error || "Error approving application");
//       }
//     });
//   };

//   return (
//     <Link href={`/dashboard/membership/${user.id}`} className="block focus:outline-none">
//       <Card
//         className={cn(
//           isCurrentUser
//             ? "border hover:border-primary transition-colors"
//             : "border hover:border-primary transition-colors",
//           "p-6 w-60"
//         )}
//       >
//         <div className="flex flex-row items-start gap-3">
//           {/* Image */}
//           <div>
//             <Avatar className="h-10 w-10 mt-1">
//               <AvatarImage src={user.image || ""} alt={user.name || "عضو"} />
//               <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
//             </Avatar>
//           </div>
//           {/* Text: name and badges */}
//           <div className="flex flex-col justify-start flex-1 max-w-40">
//             <span className="text-lg font-bold line-clamp-1 mb-2 max-w-[8rem]">
//               {user.name || "مستخدم بدون اسم"}
//             </span>
//             {/* Badges below name, two per line */}
//             {(() => {
//               const badges = [];
//               if (isCurrentUser) badges.push(<Badge key="current" variant="outline" className="text-xs">أنت</Badge>);
//               if (user.role) badges.push(
//                 <Badge key="role" variant="secondary" className="text-xs">
//                   {user.role === "ADMIN"
//                     ? "مسؤل"
//                     : user.role === "DEVELOPER"
//                     ? "مطور"
//                     : user.role === "USER"
//                     ? "مستخدم"
//                     : user.role === "MEMBER"
//                     ? "عضو"
//                     : user.role === "MEMBERSHIP"
//                     ? "امين العضوية"
//                     : user.role === "FINANCE"
//                     ? "امين المال"
//                     : user.role === "CONTENT"
//                     ? "امين المحتوى"
//                     : user.role}
//                 </Badge>
//               );
//               if (user.onboardingStatus) badges.push(
//                 <Badge key="onboarding" variant="secondary" className="text-xs">
//                   {user.onboardingStatus === "COMPLETED"
//                     ? "مكتمل"
//                     : "ناقص"}
//                 </Badge>
//               );
//               if (user.applicationStatus) badges.push(
//                 <Badge key="application" variant="secondary" className="text-xs">
//                   {user.applicationStatus === "APPROVED"
//                     ? "مقبول"
//                     : user.applicationStatus === "REJECTED"
//                     ? "مرفوض"
//                     : user.applicationStatus === "PENDING"
//                     ? "بدون رد"
//                     : user.applicationStatus}
//                 </Badge>
//               );
//               return (
//                 <>
//                   <div className="flex flex-row gap-2 mb-1">
//                     {badges.slice(0, 2)}
//                   </div>
//                   {badges.length > 2 && (
//                     <div className="flex flex-row gap-2">
//                       {badges.slice(2)}
//                     </div>
//                   )}
//                 </>
//               );
//             })()}
//           </div>
//         </div>
//         {/* Example approve button (optional, for demo) */}
//         {/* <button onClick={handleApprove} disabled={isPending} className="mt-2 text-xs bg-green-100 px-2 py-1 rounded">
//           {isPending ? "..." : "Approve"}
//         </button> */}
//         {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
//       </Card>
//     </Link>
//   );
// } 