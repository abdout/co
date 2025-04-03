'use client';
import { DocsSidebar } from "@/components/template/sidebar/docs-sidebar";
import { SidebarProvider } from "@/components/template/sidebar/sidebar";
import { DocsHeader } from "@/components/template/header/docs-header";
import React, { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;  
}

const DocsLayout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Platform header is 56px tall (h-14)
  // We want our elements to start moving when scroll is at least 10px
  // and finish transition by the time we reach full header height
  const scrollProgress = Math.min(1, Math.max(0, scrollPosition / 56));
  const translateY = -56 * scrollProgress;
  
  return (
    <SidebarProvider defaultOpen={true} open={open} onOpenChange={setOpen}>
      <div className="flex flex-col min-h-screen">
        <div className="relative">
          {/* This div ensures proper spacing even when elements are fixed */}
          <div className="h-24"></div>
          
          {/* Container for both sidebar and header that moves together */}
          <div 
            className="fixed top-14 left-0 right-0 z-40 transition-transform duration-200"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {/* Docs header */}
            <div className="pl-0 w-full bg-background border-b">
              <DocsHeader className="h-14" />
            </div>
            
            {/* Sidebar */}
            <div className="flex">
              <DocsSidebar 
                variant="sidebar" 
                collapsible="offcanvas"
                className="h-[calc(100vh-56px+56px*var(--scroll-progress))]"
                style={{ "--scroll-progress": scrollProgress } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main 
          className="flex-1 px-4 lg:px-8 py-8 transition-all duration-300 ease-in-out"
          style={{ 
            marginLeft: open ? '16rem' : '0',
            width: '100%' 
          }}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DocsLayout; 