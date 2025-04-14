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
import { AnimatePresence, motion } from 'framer-motion'

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

const PlatformHeader = () => {
  const [activeSection, setActiveSection] = useState<'project' | 'resource' | 'wallet' | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const pathname = usePathname();
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
    }, 1000); // Longer than animation duration to ensure completion
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Get the current navigation items based on active section
  const navItems = activeSection 
    ? getSecondaryNavItems(activeSection, projectId) 
    : marketingConfig.mainNav;

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.3,
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0,
      y: 5,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* 1. Logo + Name Section (always visible) */}
        <div className="flex items-center mr-6">
          <Link href="/platform" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold lg:inline-block">
              {siteConfig.name}
            </span>
          </Link>
        </div>
        
        {/* 2. Navigation Links Section (swappable) */}
        <div className="flex flex-1 items-center">
          {/* Back arrow when in a section */}
          <AnimatePresence mode="wait">
            {activeSection && !isNavigating && (
              <motion.button 
                onClick={handleBackClick}
                className="mr-4 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go back to main navigation"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Navigation items */}
          <div className="hidden md:flex overflow-hidden">
            <AnimatePresence mode="wait">
              {!isNavigating && (
                <motion.nav 
                  key={activeSection || 'main'}
                  className="flex items-center gap-4 text-sm font-medium lg:gap-6"
                  variants={navVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {navItems.map((item, index) => (
                    <motion.div key={`${item.title}-${index}`} variants={itemVariants}>
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
                    </motion.div>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="flex items-center space-x-2 md:hidden"
            onClick={() => {}}
          >
            <Icons.logo className="h-5 w-5" />
            <span className="font-medium text-sm">Menu</span>
          </button>
        </div>
        
        {/* 3. Command + Avatar + Theme Mode Section (always visible) */}
        <div className="flex items-center space-x-2">
          <CommandMenu />
          <div className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-8 w-8 px-0"
          )}>
            <UserButton />
          </div>
          <ModeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default PlatformHeader