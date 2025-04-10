'use client'
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const servicesItems = [
  {
    id: "testing-commissioning",
    title: "Testing & Commissioning",
    description: "Comprehensive testing services for high voltage equipment and systems.",
    url: "/service?id=testing-commissioning",
    image: "/service/testing.jpg",
  },
  {
    id: "low-current-systems",
    title: "Low-Current Systems",
    description: "Expert installation of protection and control systems for reliable operations.",
    url: "/service?id=low-current-systems",
    image: "/service/low-current.jpg",
  },
  {
    id: "power-generation",
    title: "Power Generation",
    description: "Specialized services for power generation facilities and infrastructure needs.",
    url: "/service?id=power-generation",
    image: "/service/generation.jpg",
  },
  {
    id: "design-installation",
    title: "Design & Installation",
    description: "Custom electrical system design for industrial projects and commercial applications.",
    url: "/service?id=design-installation",
    image: "/service/16.png",
  },
  {
    id: "splicing-termination",
    title: "Splicing & Termination",
    description: "Precision cable splicing for high voltage applications with expert craftsmanship.",
    url: "/service?id=splicing-termination",
    image: "/service/terminations.jpg",
  },
  {
    id: "transformer-oil",
    title: "Transformer Oil",
    description: "Comprehensive transformer oil testing and treatment for extended equipment life.",
    url: "/service?id=transformer-oil",
    image: "/service/trafo.jpg",
  },
];

export function ServicePage() {
  return (
    <section className="py-10 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h4 className="text-muted-foreground">provide </h4>
      <h1 className=" font-bold -mt-2 mb-10">Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-16">
          {servicesItems.map((item) => (
            <Link key={item.id} href={item.url} className="group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-sm animation-box bg-transparent">
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <h4 className="text-xl font-bold pl-2">{item.title}</h4>
              <p className="text-base text-muted-foreground mt-2 pl-2">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
