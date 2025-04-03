import { siteConfig } from './constant'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '@/components/ui/button'

const Hero = () => {
  return (
    <div className="relative h-screen w-screen -mx-6 flex flex-col items-center justify-center space-y-6 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center gap-4 text-center px-4">
        <Link
          href={siteConfig.links.twitter}
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium -mt-32 md:-mt-28"
          target="_blank"
        >
        </Link>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[90px] text-white">
          Precision testing, <br /> confidence energize.
        </h1>
        <p className="max-w-[42rem] leading-normal text-gray-200 sm:text-xl sm:leading-8">
          Engineering reliability in testing and commissioning to ensure your facility&apos;s longevity while upholding the highest standards and best practices.
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className={cn(buttonVariants({ variant: "default", size: "lg" }), " ")}
          >
            Get Quote
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "")}

          >
            Rent Kit
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero