"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { DocsSidebar } from "./docs-sidebar"
import { DocsHeader } from "./docs-header"

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col">
        <DocsHeader />
        <div className="flex flex-1 relative">
          <DocsSidebar />
          <main className="flex-1 overflow-auto px-4 ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
} 