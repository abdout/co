'use client'

import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"
import { sidebarData } from './constant'

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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/template/sidebar/sidebar"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Reorder the data to put relay at the top
const getOrderedData = () => {
  // Clone the data and sort it to ensure Relay is first
  return [...sidebarData].sort((a, b) => {
    if (a?.item === "Relay") return -1;
    if (b?.item === "Relay") return 1;
    return 0;
  });
};

// Helper function to safely convert to URL-friendly string
const toUrlPath = (str: string | undefined): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/\s+/g, '-');
}

export function DocsSidebar({ className, style, ...props }: React.ComponentProps<typeof Sidebar>) {
  // Use the reordered data
  const orderedData = getOrderedData();
  const { state, open } = useSidebar();

  return (
    <Sidebar 
      {...props} 
      className={cn(
        "border-r overflow-auto bg-background shadow-sm",
        open ? "w-64" : "hidden w-0",
        "transition-all duration-300 ease-in-out",
        className
      )}
      style={style}
    >
      <SidebarContent className="pt-4 px-2">
        <SidebarMenu>
          {orderedData.map((item, itemIndex) => (
            <SidebarMenuItem key={itemIndex}>
              <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen={itemIndex === 0}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <ChevronRight className="transition-transform" />
                    <Folder />
                    <span>
                      {item?.item || 'Unknown Item'}
                    </span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item?.subitems?.map((subitem, subitemIndex) => (
                      <SidebarMenuItem key={subitemIndex}>
                        <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <ChevronRight className="transition-transform" />
                              <Folder />
                              {subitem?.name || 'Unknown Subitem'}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {subitem?.activities && Array.isArray(subitem.activities) && subitem.activities.map((activity, activityIndex) => (
                                <Link 
                                  key={activityIndex} 
                                  href={`/docs/${toUrlPath(item?.item)}/${toUrlPath(subitem?.name)}/${toUrlPath(activity)}`}
                                >
                                  <SidebarMenuButton>
                                    <File />
                                    {activity || 'Unknown Activity'}
                                  </SidebarMenuButton>
                                </Link>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
