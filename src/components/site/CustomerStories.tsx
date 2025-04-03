import Link from "next/link";
import Image from "next/image";

const storyItems = [
  {
    id: 1,
    title: "Generating new worlds for Madonna's Celebration Tour with Runway",
    category: "Event Visuals",
    url: "/customers/generating-new-worlds-for-madonnas-celebration-tour",
    image: "https://ext.same-assets.com/1519802359/3614623504.webp",
  },
  {
    id: 2,
    title: "Distorting reality with Dan Streit and his unique A$AP Rocky music video",
    category: "Music Videos",
    url: "/customers/distorting-reality-with-dan-streit",
    image: "https://ext.same-assets.com/1519802359/2773638605.jpeg",
  },
  {
    id: 3,
    title: "How Tool is reimagining the commercial production process with Runway",
    category: "Film Production",
    url: "/customers/how-tool-is-reimagining-the-commercial-production-process-with-runway",
    image: "https://ext.same-assets.com/1519802359/1222378580.jpeg",
  },
];

const partners = [
  { id: 1, logoUrl: "https://ext.same-assets.com/3503700785/2320907649.svg", alt: "Partner 1" },
  { id: 2, logoUrl: "https://ext.same-assets.com/3503700785/1367661487.svg", alt: "Partner 2" },
  { id: 3, logoUrl: "https://ext.same-assets.com/3503700785/2018733539.svg", alt: "Partner 3" },
];

export function CustomerStories() {
  return (
    <section className="py-24 bg-runway-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-signifier mb-10">
            How the world's top creatives <br />
            are using Runway.
          </h2>

          <Link
            href="/customers"
            className="px-6 py-3 text-sm font-medium rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            More Customer Stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {storyItems.map((item) => (
            <Link key={item.id} href={item.url} className="group">
              <div className="relative h-56 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              <div className="text-sm font-medium text-white/60 mb-2">
                {item.category}
              </div>

              <h4 className="text-lg font-medium transition-colors group-hover:text-white/80">
                {item.title}
              </h4>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {partners.map((partner) => (
              <div key={partner.id} className="h-8 w-auto">
                <Image
                  src={partner.logoUrl}
                  alt={partner.alt}
                  width={100}
                  height={32}
                  className="h-full w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/product/use-cases"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              See Use Cases
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
