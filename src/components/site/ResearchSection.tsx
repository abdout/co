import Link from "next/link";
import Image from "next/image";

const researchItems = [
  {
    id: 1,
    title: "Introducing Frames",
    date: "November 25, 2024",
    url: "/research/introducing-frames",
    image: "https://ext.same-assets.com/1519802359/1680255130.webp",
  },
  {
    id: 2,
    title: "Introducing Gen-3 Alpha",
    date: "June 17, 2024",
    url: "/research/introducing-gen-3-alpha",
    image: "https://ext.same-assets.com/1519802359/197009517.webp",
  },
  {
    id: 3,
    title: "Introducing General World Models",
    date: "December 11, 2023",
    url: "/research/introducing-general-world-models",
    image: "https://ext.same-assets.com/1519802359/4229002889.png",
  },
];

export function ResearchSection() {
  return (
    <section className="py-24 bg-runway-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-signifier mb-6">Our Research</h2>
          <p className="text-lg md:text-xl font-fabriga text-white/80 max-w-2xl">
            We are pioneering general-purpose multimodal simulators of the world.
          </p>
          <Link
            href="/research"
            className="inline-block mt-4 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Read more
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchItems.map((item) => (
            <Link key={item.id} href={item.url} className="group">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              <h4 className="text-lg font-medium transition-colors group-hover:text-white/80">
                {item.title}
              </h4>

              <p className="text-sm text-white/60 mt-1">
                Research / {item.date}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
