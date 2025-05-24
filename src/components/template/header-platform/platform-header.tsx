// import { buttonVariants } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'
'use client';
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { marketingConfig } from './constant'
import { ModeSwitcher } from './mode-switcher'
import { CommandMenu } from '../header-shadcn/command-menu'
import { UserButton } from '../../auth/user-button'
import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from './constant'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MainNavItem } from './type'
import { PlatformMobileNav } from './platform-mobile-nav'

// Helper to generate secondary navigation items based on section
const getSecondaryNavItems = (section: 'project' | 'resource' | 'wallet' | null, projectId?: string): MainNavItem[] => {
  if (section === 'project' && projectId) {
    return [
      { title: "Detail", href: `/project/${projectId}` },
      { title: "ITP", href: `/project/${projectId}/itp` },
      { title: "MOS", href: `/project/${projectId}/mos` },
      { title: "Plan", href: `/project/${projectId}/plan` },
      { title: "Report", href: `/project/${projectId}/report` },
      { title: "Docs", href: `/project/${projectId}/doc` },
      { title: "Quote", href: `/project/${projectId}/quote` },
    ];
  } else if (section === 'resource') {
    return [
      { title: "Team", href: `/resource/team` },
      { title: "Kit", href: `/resource/kit` },
      { title: "Car", href: `/resource/car` },
      { title: "State", href: `/resource/state` },
    ];
  } else if (section === 'wallet') {
    return [
      { title: "Timesheet", href: `/wallet/timesheet` },
      { title: "Pettycash", href: `/wallet/pettycash` },
      { title: "Invoice", href: `/wallet/invoice` },
      { title: "Salary", href: `/wallet/salary` },
    ];
  }
  
  return [];
};

const PlatformMainNav = ({ activeSection, projectId, isNavigating, onBackClick }: {
  activeSection: 'project' | 'resource' | 'wallet' | null;
  projectId?: string;
  isNavigating: boolean;
  onBackClick: () => void;
}) => {
  const pathname = usePathname() || '';
  
  // Get the current navigation items based on active section
  const navItems = activeSection 
    ? getSecondaryNavItems(activeSection, projectId) 
    : marketingConfig.mainNav;

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/platform" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <div className="flex items-center">
        {/* Back arrow when in a section */}
        {activeSection && !isNavigating && (
          <button 
            onClick={onBackClick}
            className="mr-4 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back to main navigation"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        
        {/* Navigation items */}
        <div className="overflow-hidden">
          {!isNavigating && (
            <nav 
              key={activeSection || 'main'}
              className="flex items-center gap-4 text-sm font-medium lg:gap-6"
            >
              {navItems.map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <Link
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === item.href || pathname.startsWith(item.href)
                        ? "text-foreground"
                        : "text-foreground/60",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

const PlatformHeader = () => {
  const [activeSection, setActiveSection] = useState<'project' | 'resource' | 'wallet' | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const pathname = usePathname() || '';
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect current section from pathname
  React.useEffect(() => {
    // Only update if not in navigation transition
    if (!isNavigating) {
      // Check if we're in a project path with an ID
      const projectPathMatch = pathname.match(/^\/project\/([^\/]+)/)
      if (projectPathMatch) {
        setActiveSection('project');
        setProjectId(projectPathMatch[1]);
        return;
      }
      
      // Check if we're in a resource path
      if (pathname.startsWith('/resource')) {
        setActiveSection('resource');
        return;
      }
      
      // Check if we're in a wallet path
      if (pathname.startsWith('/wallet')) {
        setActiveSection('wallet');
        return;
      }
      
      // Reset if not in any special section
      setActiveSection(null);
      setProjectId(undefined);
    }
  }, [pathname, isNavigating]);

  // Handle back button click
  const handleBackClick = () => {
    // Prevent multiple clicks during navigation
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Navigate to the parent section page using router
    if (activeSection === 'project') {
      router.push('/project');
    } else if (activeSection === 'resource' || activeSection === 'wallet') {
      router.push('/dashboard');
    }
    
    // Reset the active section after navigation
    setActiveSection(null);
    setProjectId(undefined);
    
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Set a timeout to reset the navigation state after the animation completes
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 300); // Shorter timeout since we removed animations
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <PlatformMainNav 
          activeSection={activeSection}
          projectId={projectId}
          isNavigating={isNavigating}
          onBackClick={handleBackClick}
        />
        <PlatformMobileNav 
          activeSection={activeSection}
          projectId={projectId}
          isNavigating={isNavigating}
          onBackClick={handleBackClick}
        />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center gap-0.5">
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
  )
}

export default PlatformHeader