import * as React from "react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DocsBreadcrumb />
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl prose prose-slate prose-headings:font-semibold prose-headings:tracking-tight prose-lead:text-slate-500 prose-a:underline hover:prose-a:text-slate-900 prose-img:rounded-lg">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 