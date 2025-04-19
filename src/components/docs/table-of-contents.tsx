"use client";

import { useEffect, useState } from "react";
import { TableOfContents as TocType } from "@/types/toc";
import Link from "next/link";

interface TableOfContentsProps {
  toc: TocType;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Get all headings on the page
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ).filter((heading) => heading.id);

      // Find the heading that's currently at the top of the viewport
      const scrollY = window.scrollY;
      
      // Find the heading that's closest to the top of the page
      let currentHeading = "";
      const headingPositions = headings.map((heading) => {
        return {
          id: heading.id,
          top: heading.getBoundingClientRect().top + scrollY - 100
        };
      });
      
      for (const { id, top } of headingPositions) {
        if (scrollY >= top) {
          currentHeading = id;
        } else {
          break;
        }
      }
      
      setActiveHeading(currentHeading || "");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderItems = (items: TocType["items"], level = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <ul className={level > 0 ? "pl-4 mt-2 space-y-2" : "mt-2 space-y-2"}>
        {items.map((item, index) => {
          const isActive = activeHeading === item.url.substring(1);
          
          return (
            <li key={index} className="text-sm">
              <Link
                href={item.url}
                className={`inline-block ${isActive 
                  ? "text-blue-600 font-medium" 
                  : "text-gray-500 hover:text-gray-900"}`}
              >
                {item.title}
              </Link>
              {renderItems(item.items, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-64 border-l pl-4">
      <h4 className="text-sm font-medium mb-4">On This Page</h4>
      {renderItems(toc.items)}
    </div>
  );
} 