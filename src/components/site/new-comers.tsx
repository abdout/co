import Link from "next/link";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export function NewComersPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
            <p className="flex items-center justify-center gap-2 text-muted-foreground"><AlertTriangle className="h-4 w-4" /> Internal</p>
          <h2 className="text-3xl md:text-5xl font-signifier mb-4 ">
            New Comers
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Welcome on board
          </p>

          <Link
            href="/onboarding"
           
          >
            <Button  size= 'lg' className="rounded-full py-6">
            Onboarding
            </Button>
          </Link>

          

          
        </div>
      </div>
    </section>
  );
}
