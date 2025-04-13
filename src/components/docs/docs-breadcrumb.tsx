"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Helper function to convert slug to display text
function slugToText(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function DocsBreadcrumb() {
  const pathname = usePathname()
  
  // Return null if not in the docs section
  if (!pathname.startsWith('/docs')) {
    return null
  }
  
  // Remove the leading '/docs/' and split into segments
  const segments = pathname.replace(/^\/docs\/?/, '').split('/')
  if (segments.length === 1 && segments[0] === '') {
    segments.pop() // Remove empty segment for root /docs path
  }
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">
            Docs
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {segments.map((segment, index) => {
          // Skip empty segments
          if (!segment) return null
          
          // Build the href for this segment
          const href = `/docs/${segments.slice(0, index + 1).join('/')}`
          
          // If it's the last segment, render as the current page
          if (index === segments.length - 1) {
            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{slugToText(segment)}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            )
          }
          
          // Otherwise, render as a link
          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>
                  {slugToText(segment)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 