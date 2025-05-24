import ContactForm from "@/components/twitter/edit/contact/form";
import { Suspense } from "react";
import { getContact } from "@/components/twitter/edit/contact/action";
import { ContactSchema } from "@/components/twitter/edit/contact/validation";
import Loading from "@/components/atom/loading";

export default async function ContactPage() {
  const userData = await getContact();
  
  // Create a properly typed ContactSchema object from the userData
  const transformedData: ContactSchema | undefined = userData 
    ? {
        phone: userData.phone || '',
        whatsapp: userData.whatsapp || '',
        twitter: userData.twitter || '',
        facebook: userData.facebook || '',
        linkedin: userData.linkedin || '',
        telegram: userData.telegram || '',
        instagram: userData.instagram || '',
        tiktok: userData.tiktok || '',
      }
    : undefined;
  
  return (
    <div className=" p-6">
      <Suspense fallback={<Loading />}>
        <ContactForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
}