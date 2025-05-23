"use client"

import Link from "next/link"
import { Icons } from "../template/header-platform/icons"
import { siteConfig } from "../template/header-platform/constant"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { DocsBreadcrumb } from "./docs-breadcrumb"
import { UserButton } from "@/components/auth/user-button"
import { CommandMenu } from "@/components/template/header-shadcn/command-menu"
import { ModeSwitcher } from "@/components/template/header-platform/mode-switcher"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function DocsHeader() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <>
      {/* Fixed header container that stays in place when scrolling */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border/40 h-14">
        <div className="relative h-full w-full">
          {/* Logo section */}
          <div 
            className={cn(
              "absolute left-0 top-0 h-full flex items-center pl-4 transition-all duration-200 ease-in-out overflow-hidden",
              isExpanded ? "w-[16rem] opacity-100" : "w-0 opacity-0"
            )}
          >
            <Link href="/dashboard" className="flex px-4 items-center space-x-2 whitespace-nowrap">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold hidden lg:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>
          
          {/* Toggle + Breadcrumb section */}
          <div className={cn(
            "absolute top-0 h-full flex items-center transition-all duration-200 ease-in-out max-w-[calc(100%-220px)]",
            isExpanded ? "left-[16rem] pl-7" : "left-0 pl-7"
          )}>
            <SidebarTrigger className="mr-2 shrink-0" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 shrink-0"
            />
            <div className="overflow-hidden">
              <DocsBreadcrumb />
            </div>
          </div>
          
          {/* Right actions */}
          <div className="absolute top-0 right-0 h-full flex items-center px-6 bg-background/95">
            <CommandMenu />
            <div className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-8 w-8 px-0 ml-2"
            )}>
              <UserButton />
            </div>
            <ModeSwitcher className="ml-2" />
          </div>
        </div>
      </div>
      
      {/* Spacer to push content below the fixed header */}
      <div className="h-14"></div>
    </>
  )
} 