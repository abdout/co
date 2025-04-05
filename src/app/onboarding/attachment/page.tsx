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
            id: undefined,
            image: userData.image || undefined,
            resume: userData.resume || undefined,
            iqama: userData.iqama || undefined,
            sce: userData.sce || undefined,
            passport: userData.passport || undefined,
            drivingLicense: userData.drivingLicense || undefined
          } : undefined} 
        />
      </Suspense>
    </div>
  );
}