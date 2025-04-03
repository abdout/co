"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectNavDropdownProps {
  projectId: string;
  className?: string;
}

export function ProjectNavDropdown({ projectId, className }: ProjectNavDropdownProps) {
  const pathname = usePathname();
  
  const links = [
    { href: `/project/${projectId}`, label: "Detail" },
    { href: `/project/${projectId}/itp`, label: "ITP" },
    { href: `/project/${projectId}/mos`, label: "MOS" },
    { href: `/project/${projectId}/plan`, label: "Plan" },
    { href: `/project/${projectId}/report`, label: "Report" },
    { href: `/project/${projectId}/doc`, label: "Docs" },
    { href: `/project/${projectId}/quote`, label: "Quote" },
  ];

  // Find the active link
  const activeLink = links.find(link => 
    link.label === "Detail" 
      ? pathname === link.href 
      : pathname.startsWith(link.href)
  ) || links[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("flex items-center gap-1 outline-none", className)}>
        Project <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link
              href={link.href}
              className={cn(
                "w-full cursor-pointer",
                pathname === link.href || (link.label !== "Detail" && pathname.startsWith(link.href))
                  ? "font-medium"
                  : ""
              )}
            >
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 