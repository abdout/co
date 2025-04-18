import Link from 'next/link'
import Image from 'next/image'
import { components } from '@/components/mdx-components'

export function useMDXComponents(components) {
  return {
    h1: ({ children }) => <h1 className="mt-10 scroll-m-20 text-4xl font-bold tracking-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>,
    p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
    a: ({ children, href }) => {
      const isInternal = href?.startsWith('/')
      if (isInternal) {
        return (
          <Link href={href || '/'} className="font-medium text-blue-600 underline hover:text-blue-800">
            {children}
          </Link>
        )
      }
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      )
    },
    ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
    code: ({ children }) => (
      <code className="relative rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
        {children}
      </code>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...props}
      />
    ),
    // Merge with any custom components passed
    ...components,
  }
} 