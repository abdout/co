import Link from "next/link";
import { Button } from "../ui/button";

export function NewComersPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
            <p>Internal use only</p>
          <h2 className="text-3xl md:text-5xl font-signifier mb-6 ">
            New Comers
          </h2>

          <p className="text-base  text-muted-foreground mb-8 max-w-2xl mx-auto">
            Welcome on board
          </p>

          <Link
            href="/services"
           
          >
            <Button  className="rounded-full ">
            Onboard
            </Button>
          </Link>

          

          
        </div>
      </div>
    </section>
  );
}
