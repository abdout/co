import Link from "next/link";
import Image from "next/image";

export function StorySection() {
  return (
    <section className="py-24 bg-runway-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center">
            <span className="text-xl font-fabriga font-medium">runway</span>
            <span className="mx-2 text-white/40">Studios</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-signifier mb-12">
            For anyone with <br />
            a story to tell.
          </h2>

          <div className="relative w-full aspect-video mb-16 overflow-hidden rounded-lg">
            <Image
              src="https://ext.same-assets.com/1519802359/4291212328.webp"
              alt="Runway Studios"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-lg md:text-xl font-fabriga text-white/80 mb-10 max-w-2xl mx-auto">
            Runway Studios is the entertainment and production arm of Runway,
            dedicated to producing and funding films, documentaries,
            printed publications, music videos and other media.
          </p>

          <Link
            href="/studios"
            className="px-6 py-3 text-sm font-medium rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Go to Runway Studios
          </Link>
        </div>

        <div className="mt-24">
          <h3 className="text-xl font-fabriga mb-8">Runway Studios Initiatives</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="https://aiff.runwayml.com/" className="group block">
              <div className="mb-3 text-xl font-medium">AI Film Festival</div>
              <p className="text-white/60 text-sm">
                An annual celebration of the art and artists at the forefront of storytelling.
              </p>
            </Link>

            <Link href="https://telescopemagazine.com/" className="group block">
              <div className="mb-3 text-xl font-medium">Telescope Magazine</div>
              <p className="text-white/60 text-sm">
                An exploration of art, technology and human creativity.
              </p>
            </Link>

            <Link href="/creative-dialogues" className="group block">
              <div className="mb-3 text-xl font-medium">Creative Dialogues</div>
              <p className="text-white/60 text-sm">
                A series of conversations exploring the relationship between creativity and AI, with the people who are actually using it.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
