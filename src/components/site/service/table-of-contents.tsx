"use client";

import { useEffect, useState, createContext, useContext, RefObject } from "react";

// Context for active sections
const ActiveSectionContext = createContext<string>("");

/**
 * Hook to get active section
 */
export function useActiveSection(): string {
  return useContext(ActiveSectionContext);
}

/**
 * Service Table of Contents component
 */
export function TableOfContents({ 
  activeSection,
  overviewRef,
  featuresRef,
  processRef,
  advantagesRef,
  scrollToSection
}: { 
  activeSection: string;
  overviewRef: RefObject<HTMLDivElement | null>;
  featuresRef: RefObject<HTMLDivElement | null>;
  processRef: RefObject<HTMLDivElement | null>;
  advantagesRef: RefObject<HTMLDivElement | null>;
  scrollToSection: (ref: RefObject<HTMLDivElement | null>) => void;
}) {
  const [tocState, setTocState] = useState<'initial' | 'fixed' | 'bottom'>('initial');
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Get the position of the "Ready to Get Started?" section
      const ctaSection = document.querySelector('.cta-section');
      
      if (ctaSection) {
        const ctaSectionTop = ctaSection.getBoundingClientRect().top + window.scrollY;
        const tocHeight = 320; // Approximate height of TOC
        
        // Calculate the point where TOC should stop being fixed
        const stopFixedPoint = ctaSectionTop - tocHeight - 40; // 40px buffer
        
        if (scrollPosition < 220) {
          // Top of page - initial position
          setTocState('initial');
        } else if (scrollPosition >= stopFixedPoint) {
          // Near the CTA section - bottom position
          setTocState('bottom');
        } else {
          // Middle of page - fixed position
          setTocState('fixed');
        }
      } else {
        // If CTA section not found, simple logic
        setTocState(scrollPosition > 220 ? 'fixed' : 'initial');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check position on initial load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className={`hidden lg:block lg:w-40 xl:w-64 z-20 ${
        tocState === 'initial' 
          ? 'lg:absolute lg:right-4 lg:top-0'
          : tocState === 'fixed'
            ? 'fixed top-20 right-4 transition-all duration-300 ease-in-out'
            : 'lg:absolute lg:right-4 bottom-auto transition-all duration-300 ease-in-out' 
      }`}
      style={tocState === 'bottom' ? { 
        position: 'absolute',
        top: 'auto', 
        bottom: '580px' // Adjust based on the height of remaining content
      } : {}}
    >
      <ActiveSectionContext.Provider value={activeSection}>
        <div className="relative pl-4">
          <div className="absolute left-[21px] top-8 bottom-0 w-[0.5px] bg-white/10"></div>
          <div className="flex gap-2 items-center text-white/80 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-text size-4"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
            <p className="text-sm text-white/80 pl-0 m-0">On This Page</p>
          </div>
          
          <nav className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            <button 
              onClick={() => scrollToSection(overviewRef)}
              className={`w-full text-left px-4 py-2 border-l-2 transition ${
                activeSection === "overview" 
                  ? "text-white border-white" 
                  : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className={`w-full text-left px-4 py-2 border-l-2 transition ${
                activeSection === "features" 
                  ? "text-white border-white" 
                  : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(processRef)}
              className={`w-full text-left px-4 py-2 border-l-2 transition ${
                activeSection === "process" 
                  ? "text-white border-white" 
                  : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
              }`}
            >
              Process
            </button>
            <button 
              onClick={() => scrollToSection(advantagesRef)}
              className={`w-full text-left px-4 py-2 border-l-2 transition ${
                activeSection === "advantages" 
                  ? "text-white border-white" 
                  : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
              }`}
            >
              Advantages
            </button>
          </nav>
        </div>
      </ActiveSectionContext.Provider>
    </div>
  );
} 