"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, File, Folder } from "lucide-react"
import { sidebarData } from "./constant"

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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Helper function to convert a string to a slug
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function DocsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      className="[&_[data-sidebar=rail]]:hidden border-none pt-14" 
      {...props}
    >
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-6rem)]">
              <SidebarMenu>
                {sidebarData.map((itemData, index) => (
                  <ItemTree key={index} itemData={itemData} />
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Main item tree component (top level items)
function ItemTree({ itemData }: { itemData: { item: string; subitems: any[] } }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const itemSlug = toSlug(itemData.item)
  
  return (
    <SidebarMenuItem>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible [&[data-state=open]>div>svg:first-child]:rotate-90"
      >
        <div className="flex w-full">
          <SidebarMenuButton onClick={() => setIsOpen(!isOpen)}>
            <ChevronRight className="transition-transform" />
            <Folder />
            {itemData.item}
          </SidebarMenuButton>
        </div>
        <CollapsibleContent>
          <SidebarMenuSub>
            {itemData.subitems.map((subitem, index) => (
              <SubItemTree 
                key={index} 
                subItemData={subitem} 
                parentSlug={itemSlug} 
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

// Subitem tree component (second level items)
function SubItemTree({ 
  subItemData, 
  parentSlug 
}: { 
  subItemData: { name: string; activities: string[] };
  parentSlug: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const subitemSlug = toSlug(subItemData.name)
  
  return (
    <SidebarMenuItem>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible [&[data-state=open]>div>svg:first-child]:rotate-90"
      >
        <div className="flex w-full">
          <SidebarMenuButton onClick={() => setIsOpen(!isOpen)}>
            <ChevronRight className="transition-transform" />
            <Folder />
            {subItemData.name}
          </SidebarMenuButton>
        </div>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItemData.activities.map((activity, index) => (
              <ActivityItem 
                key={index} 
                activity={activity} 
                parentSlug={parentSlug}
                subitemSlug={subitemSlug}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

// Activity item component (file level items)
function ActivityItem({ 
  activity,
  parentSlug,
  subitemSlug
}: { 
  activity: string;
  parentSlug: string;
  subitemSlug: string;
}) {
  const router = useRouter()
  const activitySlug = toSlug(activity)
  
  const handleActivityClick = () => {
    router.push(`/docs/${parentSlug}/${subitemSlug}/${activitySlug}`)
  }
  
  return (
    <SidebarMenuButton
      onClick={handleActivityClick}
      className="data-[active=true]:bg-transparent"
    >
      <File />
      {activity}
    </SidebarMenuButton>
  )
}
