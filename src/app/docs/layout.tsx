import * as React from "react"
import { DocsLayout } from "@/components/docs/docs-layout"

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout>
      <div className="mx-auto max-w-3xl">
        {children}
      </div>
    </DocsLayout>
  )
} 


        