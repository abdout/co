"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GetStarted } from "./get-started";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/shop", label: "Shop" },
  { href: "/dashboard", label: "Platform" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={cn(
      "fixed top-0 z-[1000] w-full transition-colors duration-300 pointer-events-auto",
      scrolled ? "bg-primary" : "bg-transparent"
    )}>
      <div className=" h-14 mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-background font-bold flex items-center">
            <span className="text-xl font-fabriga">company</span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-fabriga font-medium text-background/80 hover:text-background transition-colors px-4 cursor-pointer"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
           <GetStarted />
          </div>
        </div>
      </div>
    </nav>
  );
}
