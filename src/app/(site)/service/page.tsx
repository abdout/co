import { ServiceDetailPage } from "@/components/site/service/service";
import { SiteFooter } from "@/components/template/footer/site-footer";

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <ServiceDetailPage />
      <SiteFooter /> 
    </main>
  );
}
