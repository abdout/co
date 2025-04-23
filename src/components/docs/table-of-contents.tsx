"use client";

import { useEffect, useState, useRef, createContext, useContext } from "react";
import { TableOfContents as TocType } from "@/types/toc";
import Link from "next/link";

// Context for active anchors
const ActiveAnchorContext = createContext<string[]>([]);

/**
 * Hook to get all visible anchors
 */
export function useActiveAnchors(): string[] {
  return useContext(ActiveAnchorContext);
}

/**
 * Custom hook that observes headings on the page and returns active ones
 */
function useAnchorObserver(headings: string[], single = true): string[] {
  const [activeAnchors, setActiveAnchors] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings: string[] = [];

      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visibleHeadings.push(id);
        }
      });

      if (visibleHeadings.length > 0) {
        // If single mode, only keep the first visible heading
        // Otherwise, return all visible headings
        setActiveAnchors(single ? [visibleHeadings[0]] : visibleHeadings);
      } else if (activeAnchors.length > 0 && visibleHeadings.length === 0) {
        // Only clear anchors if we had some before and now have none
        setActiveAnchors([]);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-100px 0px -75%',
      threshold: [0, 1],
    });

    headings.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings, single, activeAnchors]);

  return activeAnchors;
}

/**
 * TOC item component that highlights when the corresponding heading is in view
 */
function TOCItem({ item, level = 0 }: { item: TocType["items"][0], level: number }) {
  const anchors = useActiveAnchors();
  const id = item.url.slice(1);
  const isActive = anchors.includes(id);

  return (
    <li className="relative py-1 list-none ml-5">
      {isActive && (
        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-[2px] h-[24px] bg-primary " />
      )}
      <Link
        href={item.url}
        className={`block text-sm font-normal !no-underline  ${isActive 
          ? 'text-primary  ' 
          : 'text-muted-foreground hover:text-primary'}`}
        style={{ textDecoration: 'none' }}
      >
        {item.title}
      </Link>
      {/* Temporarily commented out nested items rendering
      {item.items && item.items.length > 0 && (
        <ul className="mt-1 ml-1 pl-3 border-l border-primary list-none p-0">
          {item.items.map((child, i) => (
            <TOCItem key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
      */}
    </li>
  );
}

export function TableOfContents({ toc }: { toc: TocType }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headings = toc.items.map(item => item.url.substring(1));
  
  return (
    <div ref={containerRef} className="fixed right-10 top-24 w-auto max-h-[calc(100vh-120px)] overflow-y-auto">
      <ActiveAnchorContext.Provider value={useAnchorObserver(headings)}>
        <div className="relative pl-4">
          <div className="absolute left-[21px] top-8 bottom-0 w-[0.5px] bg-gray-200"></div>
          <div className="flex gap-2 items-center text-muted-foreground ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-text size-4"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
            <p className="text-sm text-muted-foreground pl-0 m-0">On This Page</p>
          </div>
          
          <nav className="relative">
            <ul className="list-none p-0 m-0">
              {toc.items.map((item, i) => (
                <TOCItem key={i} item={item} level={0} />
              ))}
            </ul>
          </nav>
        </div>
      </ActiveAnchorContext.Provider>
    </div>
  );
} 