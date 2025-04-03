
import AttachmentForm from "@/components/onboarding/attachment/form";
import { Suspense } from "react";
import { getAttachment } from "@/components/onboarding/attachment/action";

export default async function AttachmentPage() {
  const userData = await getAttachment();
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <AttachmentForm 
          type={userData ? "update" : "create"} 
          data={userData ? {
            ...userData,
            image: userData.image || undefined,
            cv: userData.cv || undefined,
            portfolio: userData.portfolio || undefined,
            additionalFile: userData.additionalFile || undefined
          } : undefined} 
        />
      </Suspense>
    </div>
  );
}