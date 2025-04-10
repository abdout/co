import { HeroPage } from "@/components/site/hero";
import { BorchurePage } from "@/components/site/borchure";
import { ServicePage } from "@/components/site/service";
import { NumberSection } from "@/components/site/number";
import { ClientSection } from "@/components/site/client";
import { TeamPage } from "@/components/site/board";
import MapPage from "@/components/site/map";
import LetsWorkTogether from "@/components/site/lets-work-together";
import { NewComersPage } from "@/components/site/new-comers";
import Gallery from "@/components/site/gallery/gallery";
import { SiteFooter } from "@/components/template/footer/site-footer";
export default function Home() {
  return (
    <main className="min-h-screen ">
    
      <HeroPage />
      <BorchurePage />
      <ServicePage/>
      <NumberSection />
      <ClientSection />
      <TeamPage />
      <Gallery />
      <LetsWorkTogether />
      <MapPage />
      <NewComersPage />
      <SiteFooter />

    </main>
  );
}
