import * as React from "react"
import { DocsLayout } from "@/components/docs/docs-layout"

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout>
      <div className="mx-auto max-w-3xl prose prose-slate prose-headings:font-semibold prose-headings:tracking-tight prose-lead:text-slate-500 prose-a:underline hover:prose-a:text-slate-900 prose-img:rounded-lg">
        {children}
      </div>
    </DocsLayout>
  )
} 


        