import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger, useSidebar } from "@/components/template/sidebar/sidebar"
import { cn } from "@/lib/utils"

interface DocsHeaderProps {
  className?: string
}

export function DocsHeader({ className }: DocsHeaderProps) {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)
  const { open } = useSidebar()

  return (
    <div 
      className={cn(
        "flex items-center transition-all duration-300 ease-in-out", 
        className
      )}
      style={{
        paddingLeft: open ? "calc(16rem + 1rem)" : "1rem"
      }}
    >
      <div className="flex items-center h-10">
        <SidebarTrigger className="mr-3" />
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            
            {paths.length > 0 && (
              <>
                {paths.map((path, index) => {
                  const href = `/${paths.slice(0, index + 1).join("/")}`
                  const isLast = index === paths.length - 1
                  
                  const formattedPath = path
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  
                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={href}>{formattedPath}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
} 