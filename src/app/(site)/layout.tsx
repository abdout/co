// import { SiteFooter } from "@/components/site-footer"

import { SiteHeader } from "@/components/site/header"




interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col -mx-4">
      <SiteHeader />
      <main className="flex flex-1 flex-col ">{children}</main>
    </div>
  )
}