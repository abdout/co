import React from 'react'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'error'

type CalloutProps = {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

const typeStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800'
}

const titleStyles = {
  info: 'text-blue-600',
  warning: 'text-amber-600',
  error: 'text-red-600'
}

export function Callout({ 
  type = 'info', 
  title, 
  children, 
  className 
}: CalloutProps) {
  return (
    <div className={cn(
      'my-6 rounded-lg border p-4',
      typeStyles[type],
      className
    )}>
      {title && (
        <h4 className={cn('mb-2 font-medium', titleStyles[type])}>
          {title}
        </h4>
      )}
      <div>
        {children}
      </div>
    </div>
  )
} 