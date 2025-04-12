// import { buttonVariants } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'
'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { MainNav } from './main-nav'
import { marketingConfig } from './constant'
import { ModeSwitcher } from './mode-switcher'
import { CommandMenu } from '../header-shadcn/command-menu'
import { UserButton } from '../../auth/user-button'
import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from './constant'
import { usePathname } from 'next/navigation'
import { SecondaryHeader } from './secondary-header'

const PlatformHeader = () => {
  const [activeSection, setActiveSection] = useState<'project' | 'resource' | 'wallet' | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  // Handle section changes from MainNav
  const handleSectionChange = (section: 'project' | 'resource' | 'wallet' | null, id?: string) => {
    setActiveSection(section);
    setProjectId(id);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <MainNav 
            items={marketingConfig.mainNav} 
            onSectionChange={handleSectionChange}
          />
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center">
              <div className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "h-8 w-8 px-0"
              )}>
                <UserButton />
              </div>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </header>
      
      {/* Secondary Header - only shows if an active section is selected */}
      {activeSection && (
        <SecondaryHeader 
          section={activeSection} 
          projectId={projectId}
        />
      )}
    </>
  )
}

export default PlatformHeader