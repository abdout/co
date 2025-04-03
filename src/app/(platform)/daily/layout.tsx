'use client'

import DailyProvider from '@/components/platform/daily/context'

export default function DailyLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <DailyProvider>
      {children}
    </DailyProvider>
  )
} 