import { Suspense } from "react";
import Form from "@/components/twitter/edit/contribute/form";
import { getContribute } from "@/components/twitter/edit/contribute/action";
import type { ContributeSchema } from "@/components/twitter/edit/contribute/validation";
import Loading from "@/components/atom/loading";

export default async function ContributePage() {
  const userData = await getContribute();
  
  // Transform userData to replace null values with undefined and ensure type safety
  const transformedData: ContributeSchema | undefined = userData ? {
    ...Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    )
  } as ContributeSchema : undefined;
  
  return (
    <div className="w-full md:w-[55%] mx-auto">
      <Suspense fallback={<Loading />}>
        <Form 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
}
