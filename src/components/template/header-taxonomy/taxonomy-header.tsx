'use client';

import { cn } from '@/lib/utils'
import React from 'react'
import { MainNav } from './main-nav'
import { marketingConfig } from './constant'
import { ModeSwitcher } from './mode-switcher'
import { AuthButton } from './auth-button'

const TaxonomyHeader = () => {
  return (
    <header className="container z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-6">
        <MainNav items={marketingConfig.mainNav} />
        <div className='flex items-center gap-2'>
          <AuthButton />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default TaxonomyHeader