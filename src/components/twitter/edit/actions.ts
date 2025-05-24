// // serverActions.ts

// "use server";
// import { revalidatePath } from "next/cache";
// import { db } from "@/lib/db";
// import { currentUser } from "@/lib/auth";
// import { onboardingRoutes } from "./types";
// import type { ContactFormData } from "./schemas";

// // export const switchFollow = async (userId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const existingFollow = await db.follower.findFirst({
// //       where: {
// //         followerId: currentUserId,
// //         followingId: userId,
// //       },
// //     });

// //     if (existingFollow) {
// //       await db.follower.delete({
// //         where: {
// //           id: existingFollow.id,
// //         },
// //       });
// //     } else {
// //       const existingFollowRequest = await db.followRequest.findFirst({
// //         where: {
// //           senderId: currentUserId,
// //           receiverId: userId,
// //         },
// //       });

// //       if (existingFollowRequest) {
// //         await db.followRequest.delete({
// //           where: {
// //             id: existingFollowRequest.id,
// //           },
// //         });
// //       } else {
// //         await db.followRequest.create({
// //           data: {
// //             senderId: currentUserId,
// //             receiverId: userId,
// //           },
// //         });
// //       }
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong!");
// //   }
// // };

// // export const switchBlock = async (userId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const existingBlock = await db.block.findFirst({
// //       where: {
// //         blockerId: currentUserId,
// //         blockedId: userId,
// //       },
// //     });

// //     if (existingBlock) {
// //       await db.block.delete({
// //         where: {
// //           id: existingBlock.id,
// //         },
// //       });
// //     } else {
// //       await db.block.create({
// //         data: {
// //           blockerId: currentUserId,
// //           blockedId: userId,
// //         },
// //       });
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong!");
// //   }
// // };

// // export const acceptFollowRequest = async (userId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const existingFollowRequest = await db.followRequest.findFirst({
// //       where: {
// //         senderId: userId,
// //         receiverId: currentUserId,
// //       },
// //     });

// //     if (existingFollowRequest) {
// //       await db.followRequest.delete({
// //         where: {
// //           id: existingFollowRequest.id,
// //         },
// //       });

// //       await db.follower.create({
// //         data: {
// //           followerId: userId,
// //           followingId: currentUserId,
// //         },
// //       });
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong!");
// //   }
// // };

// // export const declineFollowRequest = async (userId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const existingFollowRequest = await db.followRequest.findFirst({
// //       where: {
// //         senderId: userId,
// //         receiverId: currentUserId,
// //       },
// //     });

// //     if (existingFollowRequest) {
// //       await db.followRequest.delete({
// //         where: {
// //           id: existingFollowRequest.id,
// //         },
// //       });
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong!");
// //   }
// // };

// // Create a specific type for the profile update data
// interface ProfileUpdateData {
//   // Common fields across different profile update operations
//   [key: string]: string | number | boolean | Date | { increment: number } | undefined;
// }

// export async function updateProfile(formData: ProfileUpdateData) {
//   try {
//     const user = await currentUser();
//     if (!user?.id) throw new Error("Unauthorized");

//     // Update user with form data
//     const updatedUser = await db.user.update({
//       where: { id: user.id },
//       data: {
//         ...formData,
//         onboardingStatus: "IN_PROGRESS",
//         onboardingStep: {
//           increment: 1
//         },
//         updatedAt: new Date()
//       }
//     });

//     revalidatePath('/onboarding');
//     return { success: true, user: updatedUser };
//   } catch (error) {
//     console.error("Profile update error:", error);
//     return { success: false, error: "Failed to update profile" };
//   }
// }

// // export const switchLike = async (postId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const existingLike = await db.like.findFirst({
// //       where: {
// //         postId,
// //         userId: currentUserId,
// //       },
// //     });

// //     if (existingLike) {
// //       await db.like.delete({
// //         where: {
// //           id: existingLike.id,
// //         },
// //       });
// //     } else {
// //       await db.like.create({
// //         data: {
// //           postId,
// //           userId: currentUserId,
// //         },
// //       });
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong");
// //   }
// // };

// // export const addComment = async (postId: string, desc: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     const createdComment = await db.comment.create({
// //       data: {
// //         desc,
// //         userId: currentUserId,
// //         postId,
// //       },
// //       include: {
// //         user: true,
// //       },
// //     });

// //     return createdComment;
// //   } catch (err) {
// //     console.log(err);
// //     throw new Error("Something went wrong!");
// //   }
// // };

// // export const addPost = async (formData: FormData, img: string) => {
// //   console.log("Received image URL in addPost:", img);
// //   const desc = formData.get("desc") as string;

// //   const Desc = z.string().min(1).max(255);

// //   const validatedDesc = Desc.safeParse(desc);

// //   if (!validatedDesc.success) {
// //     console.log("description is not valid");
// //     return;
// //   }

// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     await db.post.create({
// //       data: {
// //         desc: validatedDesc.data,
// //         userId: currentUserId,
// //         img,
// //       },
// //     });

// //     revalidatePath("/");
// //   } catch (err) {
// //     console.log(err);
// //   }
// // };


// // export const deletePost = async (postId: string) => {
// //   const user = await currentUser();

// //   if (!user || !user.id) {
// //     throw new Error("User is not authenticated!");
// //   }

// //   const currentUserId = user.id;

// //   try {
// //     await db.post.delete({
// //       where: {
// //         id: postId,
// //         userId: currentUserId,
// //       },
// //     });
// //     revalidatePath("/");
// //   } catch (err) {
// //     console.log(err);
// //   }
// // };

// export async function updateOnboardingStep(step: number) {
//   const user = await currentUser();
//   if (!user?.id) throw new Error("Unauthorized");

//   await db.user.update({
//     where: { id: user.id },
//     data: { 
//       onboardingStep: step,
//       onboardingStatus: step >= 6 ? "COMPLETED" : "IN_PROGRESS"
//     }
//   });

//   revalidatePath("/onboarding");
// }

// export async function submitTerms(data: { oathAcknowledged: boolean }) {
//   const user = await currentUser();
//   if (!user?.id) throw new Error("Unauthorized");

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       oathAcknowledged: data.oathAcknowledged,
//       onboardingStep: 2,
//       onboardingStatus: "IN_PROGRESS"
//     }
//   });

//   return { success: true, nextUrl: onboardingRoutes.ATTACHMENT };
// }

// export async function submitAttachment(data: {
//   image?: string;
//   cv?: string;
//   additionalFile?: string;
// }) {
//   const user = await currentUser();
//   if (!user?.id) throw new Error("Unauthorized");

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       ...data,
//       onboardingStep: 3
//     }
//   });

//   return { success: true, nextUrl: onboardingRoutes.CONTACT };
// }

// type ActionState = {
//   success: boolean;
//   error: boolean;
//   message?: string;
// };

// export async function submitContact(
//   prevState: ActionState,
//   formData: ContactFormData
// ): Promise<ActionState> {
//   try {
//     const user = await currentUser();
//     if (!user?.id) {
//       return {
//         success: false,
//         error: true,
//         message: "غير مصرح لك"
//       };
//     }

//     // Upsert contact record
//     const contact = await db.contact.upsert({
//       where: {
//         userId: user.id
//       },
//       update: {
//         ...formData,
//       },
//       create: {
//         ...formData,
//         userId: user.id
//       }
//     });

//     // Update user's onboarding step
//     await db.user.update({
//       where: { id: user.id },
//       data: {
//         contact: {
//           connect: {
//             id: contact.id
//           }
//         },
//         onboardingStep: 4,
//         onboardingStatus: "IN_PROGRESS"
//       }
//     });

//     revalidatePath("/onboarding");
//     return {
//       success: true,
//       error: false,
//       message: "تم حفظ البيانات بنجاح"
//     };
//   } catch (error) {
//     console.error("Contact update error:", error);
//     return {
//       success: false,
//       error: true,
//       message: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ البيانات"
//     };
//   }
// }

// export async function submitAddress(data: {
//   currentCountry: string;
//   currentState: string;
//   currentLocality: string;
//   currentAdminUnit?: string;
//   currentNeighborhood?: string;
//   originalCountry?: string;
//   originalState?: string;
//   originalLocality?: string;
//   originalAdminUnit?: string;
//   originalNeighborhood?: string;
// }) {
//   const user = await currentUser();
//   if (!user?.id) throw new Error("Unauthorized");

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       ...data,
//       onboardingStep: 5
//     }
//   });

//   return { success: true, nextUrl: onboardingRoutes.EDUCATION };
// }

// export async function submitBirthdate(data: {
//   birthCountry: string;
//   birthLocality: string;
//   birthYear: number;
//   birthMonth: number;
// }) {
//   const user = await currentUser();
//   if (!user?.id) throw new Error("Unauthorized");

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       ...data,
//       onboardingStep: 6,
//       onboardingStatus: "COMPLETED"
//     }
//   });

//   return { success: true, nextUrl: "/dashboard" };
// }
