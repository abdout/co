import { HeroPage } from "@/components/site/hero";
import { BorchurePage } from "@/components/site/borchure";
import { ServicePage } from "@/components/site/service";
import { ResearchSection } from "@/components/site/ResearchSection";
import { StorySection } from "@/components/site/StorySection";
import { CustomerStories } from "@/components/site/CustomerStories";
import { Footer } from "@/components/site/footer";
import { NumberSection } from "@/components/site/number";
import { ClientSection } from "@/components/site/client";
import { TeamPage } from "@/components/site/team";
import Social from "@/components/site/social";
import MapPage from "@/components/site/map";
import LetsWorkTogether from "@/components/site/lets-work-together";
import { NewComersPage } from "@/components/site/new-comers";
import Gallery from "@/components/site/gallery/gallery";

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
      {/* <ResearchSection />
      <StorySection />
      <CustomerStories /> */}
      <Footer />
    </main>
  );
}
