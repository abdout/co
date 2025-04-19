"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, File, Folder } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { sidebarNav } from "@/components/docs/constant"
import { SidebarNavItem } from "@/components/docs/type"

export function DocsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      className="[&_[data-sidebar=rail]]:hidden border-none pt-14" 
      {...props}
    >
      <SidebarContent className="px-2 pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-7rem)] ">
              <SidebarMenu>
                {sidebarNav.map((category, index) => (
                  <CategoryItem key={index} category={category} />
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Category item component (top level)
function CategoryItem({ category }: { category: SidebarNavItem }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  
  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-[89%] text-base">
            <ChevronRight 
              className={cn(
                "h-6 w-6 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90 text-primary"
              )}
            />
            <span className={cn("", isOpen && "text-primary")}>{category.title}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {category.items?.map((item, index) => (
              <Link 
                key={index}
                href={item.href || "#"}
                className={cn(
                  "flex w-[97%] items-center ml-1",
                  pathname === item.href && "text-primary"
                )}
              >
                <SidebarMenuButton className="data-[active=true]:bg-transparent">
                  {item.title}
                </SidebarMenuButton>
              </Link>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
