'use client'

import React from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { cn } from '@/lib/utils'

// Define the components that will be used in MDX
const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn('mt-8 scroll-m-20 text-4xl font-bold tracking-tight', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn('mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn('mt-8 scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn('mt-8 scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn('border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right', className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right', className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn('rounded-md border', className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  // Add error handling for MDX component
  try {
    const MdxComponent = useMDXComponent(code || '')
    
    if (!code) {
      return <div className="mdx"><p>No content available.</p></div>
    }
    
    return (
      <div className="mdx">
        <MdxComponent components={components} />
      </div>
    )
  } catch (error) {
    console.error('Error rendering MDX content:', error)
    return (
      <div className="mdx">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-lg font-semibold text-red-800">Error rendering content</h3>
          <p className="text-red-700">There was an error rendering this content. Please try rebuilding the documentation.</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      </div>
    )
  }
} 