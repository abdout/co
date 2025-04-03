"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { resrc } from "@/constant/header";

interface ResourceNavDropdownProps {
  className?: string;
}

export function ResourceNavDropdown({ className }: ResourceNavDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");
  const [isHovering, setIsHovering] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Resource links from constants
  const links = resrc;
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Find the active link when component mounts or pathname changes
  React.useEffect(() => {
    const currentLink = links.find(link => pathname.startsWith(link.href));
    
    if (currentLink) {
      setActiveSection(currentLink.label);
    }
  }, [pathname]);

  // Handle navigation
  const handleNavigation = (href: string, label: string) => {
    setIsOpen(false);
    setActiveSection(label);
    router.push(href);
  };
  
  // Get dropdown position
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
  
  React.useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, 
        left: rect.left
      });
    }
  }, [isOpen]);
  
  return (
    <div ref={dropdownRef} className="flex-shrink-0">
      <button
        className={cn(
          "flex items-center gap-1 outline-none transition-colors", 
          isHovering ? "text-foreground" : "", 
          isOpen ? "text-foreground" : "",
          className
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          Resource <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      
      {/* Portal for dropdown menu */}
      {isOpen && (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen" style={{ pointerEvents: "none" }}>
          <div 
            className="absolute bg-popover rounded-md shadow-md border border-border p-1 overflow-hidden"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              pointerEvents: "auto",
              minWidth: "150px"
            }}
          >
            <div>
              {links.map((link) => (
                <div
                  key={link.href}
                  onMouseEnter={() => setHoveredItem(link.label)}
                  onMouseLeave={() => setHoveredItem("")}
                >
                  <button
                    className="w-full text-left block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(link.href, link.label);
                    }}
                  >
                    <div
                      className={cn(
                        "w-full cursor-pointer px-2 py-1.5 rounded-sm",
                        activeSection === link.label
                          ? "font-medium bg-accent/50"
                          : "",
                        hoveredItem === link.label && activeSection !== link.label
                          ? "bg-accent/20"
                          : ""
                      )}
                    >
                      {link.label}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 