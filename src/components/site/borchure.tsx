import Link from "next/link";
import { Button } from "../ui/button";

export function BorchurePage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-signifier mb-6 ">
            Excellence in Electrical <br />
            Testing & Commissioning
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Delivering comprehensive electrical testing services with state-of-the-art equipment and expert engineers for power systems, switchgear, and critical installations.
          </p>

          <Link
            href="/services"
           
          >
            <Button variant='outline' size='lg' className="rounded-full ">
            Borchure
            </Button>
          </Link>

          <div className="mt-10 relative aspect-video w-full max-w-5xl mx-auto rounded-sm overflow-hidden bg-black/5">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/story.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-4 right-4 text-background text-sm">
              company
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
