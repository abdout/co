"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/shop", label: "Shop" },
  { href: "/dashboard", label: "Platform" },
];

export function SiteMobileNav() {
  const [open, setOpen] = React.useState(false)

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
    },
    []
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6 text-background"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <MobileLink
                key={link.href}
                href={link.href}
                onOpenChange={setOpen}
                className="text-lg font-medium py-2"
              >
                {link.label}
              </MobileLink>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-base transition-colors hover:text-primary", className)}
      {...props}
    >
      {children}
    </Link>
  )
} 