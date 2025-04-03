import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { MainNav } from './main-nav'
import { marketingConfig } from './constant'
import { ModeSwitcher } from './mode-switcher'

const TaxonomyHeader = () => {
  return (
    <header className="container z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-6">
        <MainNav items={marketingConfig.mainNav} />
        <div className='flex items-center gap-2'>
          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav>
          <ModeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default TaxonomyHeader