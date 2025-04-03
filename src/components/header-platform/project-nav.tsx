"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ProjectNavProps {
  projectId: string;
}

export function ProjectNav({ projectId }: ProjectNavProps) {
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

  return (
    <div className="ml-8 border-l border-border/40 pl-8">
      <nav>
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li
              key={link.href}
              className={
                (
                  link.label === "Detail"
                    ? pathname === link.href
                    : pathname.startsWith(link.href)
                )
                  ? "font-medium"
                  : "text-foreground/60 hover:text-foreground/80 transition-colors"
              }
            >
              <Link href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 