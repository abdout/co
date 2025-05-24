"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from 'lucide-react'
import { marketingConfig } from './constant'
import { cn } from "@/lib/utils"
import { useMetaColor } from "./use-meta-color"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { MainNavItem } from './type'

// Helper to generate secondary navigation items based on section (same as in main header)
const getSecondaryNavItems = (section: 'project' | 'resource' | 'wallet' | null, projectId?: string): MainNavItem[] => {
  if (section === 'project' && projectId) {
    return [
      { title: "Detail", href: `/project/${projectId}` },
      { title: "ITP", href: `/project/${projectId}/itp` },
      { title: "MOS", href: `/project/${projectId}/mos` },
      { title: "Plan", href: `/project/${projectId}/plan` },
      { title: "Report", href: `/project/${projectId}/report` },
      { title: "Docs", href: `/project/${projectId}/doc` },
      { title: "Quote", href: `/project/${projectId}/quote` },
    ];
  } else if (section === 'resource') {
    return [
      { title: "Team", href: `/resource/team` },
      { title: "Kit", href: `/resource/kit` },
      { title: "Car", href: `/resource/car` },
      { title: "State", href: `/resource/state` },
    ];
  } else if (section === 'wallet') {
    return [
      { title: "Timesheet", href: `/wallet/timesheet` },
      { title: "Pettycash", href: `/wallet/pettycash` },
      { title: "Invoice", href: `/wallet/invoice` },
      { title: "Salary", href: `/wallet/salary` },
    ];
  }
  
  return [];
};

interface PlatformMobileNavProps {
  activeSection: 'project' | 'resource' | 'wallet' | null;
  projectId?: string;
  isNavigating: boolean;
  onBackClick: () => void;
}

export function PlatformMobileNav({ activeSection, projectId, isNavigating, onBackClick }: PlatformMobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const { setMetaColor, metaColor } = useMetaColor()

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      setMetaColor(open ? "#09090b" : metaColor)
    },
    [setMetaColor, metaColor]
  )

  // Get the current navigation items based on active section
  const navItems = activeSection 
    ? getSecondaryNavItems(activeSection, projectId) 
    : marketingConfig.mainNav;

  const getSectionTitle = (section: 'project' | 'resource' | 'wallet' | null): string => {
    if (section === 'project') return 'Project Navigation';
    if (section === 'resource') return 'Resource Navigation';
    if (section === 'wallet') return 'Wallet Navigation';
    return 'Main Navigation';
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <div className="overflow-auto p-6">
          {/* Header with back button if in section */}
          {activeSection && !isNavigating && (
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <button 
                onClick={() => {
                  onBackClick();
                  setOpen(false);
                }}
                className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go back to main navigation"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h4 className="font-medium text-sm text-muted-foreground">
                {getSectionTitle(activeSection)}
              </h4>
            </div>
          )}
          
          {/* Navigation items */}
          {!isNavigating && (
            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <MobileLink
                  key={`${item.title}-${index}`}
                  href={item.disabled ? "#" : item.href}
                  onOpenChange={setOpen}
                  className={cn(
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {item.title}
                </MobileLink>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  )
} 