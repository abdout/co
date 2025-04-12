"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNavItem } from "./type"
import { siteConfig } from "./constant"
import { cn } from "@/lib/utils"
import { useLockBody } from "./use-lock-body"
import { Icons } from "./icons"
import { resrc } from '@/constant/header'

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
}

export function MobileNav({ items, children }: MobileNavProps) {
  useLockBody()
  const pathname = usePathname()
  
  // Check if we're in a project path with an ID
  const projectPathMatch = pathname.match(/^\/project\/([^\/]+)/)
  const isProjectPage = !!projectPathMatch
  const projectId = projectPathMatch ? projectPathMatch[1] : null
  
  // Check if we're in a resource path
  const isResourcePath = pathname.startsWith('/resource')
  
  // Check if we're in a wallet path
  const isWalletPath = pathname.startsWith('/wallet')
  
  // Generate secondary navigation items based on the current path
  const getSecondaryItems = () => {
    if (isProjectPage && projectId) {
      return [
        { href: `/project/${projectId}`, label: "Detail" },
        { href: `/project/${projectId}/itp`, label: "ITP" },
        { href: `/project/${projectId}/mos`, label: "MOS" },
        { href: `/project/${projectId}/plan`, label: "Plan" },
        { href: `/project/${projectId}/report`, label: "Report" },
        { href: `/project/${projectId}/doc`, label: "Docs" },
        { href: `/project/${projectId}/quote`, label: "Quote" },
      ];
    } else if (isResourcePath) {
      return resrc; // Use the resource links from the constant file
    } else if (isWalletPath) {
      return [
        { href: `/wallet/timesheet`, label: "Timesheet" },
        { href: `/wallet/pettycash`, label: "Pettycash" },
        { href: `/wallet/invoice`, label: "Invoice" },
        { href: `/wallet/salary`, label: "Salary" },
      ];
    }
    
    return [];
  };
  
  const secondaryItems = getSecondaryItems();

  return (
    <div
      className={cn(
        "fixed inset-0 top-14 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto pb-32 shadow-md animate-in slide-in-from-top md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-background p-4 shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <Link
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                  {
                    "bg-muted": 
                      (item.title === "Project" && isProjectPage) ||
                      (item.title === "Resource" && isResourcePath) ||
                      (item.title === "Wallet" && isWalletPath) ||
                      (item.href === pathname && 
                       item.title !== "Project" && 
                       item.title !== "Resource" &&
                       item.title !== "Wallet"),
                  },
                  item.disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {item.title}
              </Link>
              
              {/* Show secondary navigation if this is the active section */}
              {((item.title === "Project" && isProjectPage) || 
                (item.title === "Resource" && isResourcePath) ||
                (item.title === "Wallet" && isWalletPath)) && 
                secondaryItems.length > 0 && (
                <div className="ml-4 pl-4 border-l border-border/60">
                  {secondaryItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={cn(
                        "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                        {
                          "text-foreground": pathname === subItem.href || 
                            (subItem.label !== "Detail" && pathname.startsWith(subItem.href)),
                          "text-foreground/60": !(pathname === subItem.href || 
                            (subItem.label !== "Detail" && pathname.startsWith(subItem.href))),
                        }
                      )}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}