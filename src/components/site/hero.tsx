"use client";

import Link from "next/link";
import Image from "next/image";

export function HeroPage() {
  return (
    <section className="relative w-full h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.avif"
          alt="Hero background"
          fill
          className="object-cover brightness-75"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-background">
        <div className="space-y-4 pt-24">
          <h1 className="font-heading leading-wide text-lg sm:text-xl md:text-2xl lg:text-6xl font-bold text-background">
            Precision testing, <br /> confidence energize.
          </h1>

          <p className="max-w-[42rem] leading-normal text-background/80 sm:text-xl sm:leading-8">
            Engineering reliability in testing and commissioning to ensure your facility&apos;s longevity while upholding the highest standards and best practices.
          </p>

          <div className="flex items-center gap-4 pt-8">
            <Link
              href="/quote"
              className="px-6 py-3 text-sm font-medium rounded-full bg-background text-primary hover:bg-white/90 transition-colors inline-flex items-center"
            >
              Get Quote
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 text-sm font-medium rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Rent Kit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
