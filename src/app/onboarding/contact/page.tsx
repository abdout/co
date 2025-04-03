import ContactForm from "@/components/onboarding/contact/form";
import { Suspense } from "react";
import { getContact } from "@/components/onboarding/contact/action";

export default async function ContactPage() {
  const userData = await getContact();
  
  // Transform null values to undefined
  const transformedData = userData 
    ? Object.fromEntries(
        Object.entries(userData).map(([key, value]) => 
          [key, value === null ? undefined : value]
        )
      ) 
    : undefined;
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
}