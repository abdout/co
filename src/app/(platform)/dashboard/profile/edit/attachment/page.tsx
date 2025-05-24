import AttachmentForm from "@/components/twitter/edit/attachment/form";
import { Suspense } from "react";
import { getAttachment } from "@/components/twitter/edit/attachment/action";
import Loading from "@/components/atom/loading";

export default async function AttachmentPage() {
  const userData = await getAttachment();
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<Loading />}>
        <AttachmentForm 
          type={userData ? "update" : "create"} 
          data={userData ? {
            ...userData,
            image: userData.image || '',
            cv: userData.cv || undefined,
            portfolio: userData.portfolio || undefined,
            cover: userData.cover || undefined
          } : undefined} 
        />
      </Suspense>
    </div>
  );
}