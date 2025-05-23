import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'
import { RelayEquipmentDisplay } from './components/docs/RelayEquipmentDisplay'

// Create a simple EquipmentImages component since the original file doesn't exist
function EquipmentImages() {
  return (
    <div className="equipment-images-container">
      <div className="w-full overflow-x-auto whitespace-nowrap py-2" style={{ display: 'block' }}>
        {['freja300.png', 'sverker750.png', 'cmc356.png', 'dlro600.png'].map((img, i) => (
          <span key={i} className="inline-block w-14 mx-1 text-center align-top">
            <img 
              src={`/kit/${img}`} 
              alt={img.replace('.png', '')} 
              className="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
            />
            <span className="text-xs block truncate">{img.replace('.png', '')}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Add our custom components
    RelayEquipmentDisplay,
    EquipmentImages,
    
    // Override the default components with our custom ones
    h1: ({ children }) => (
      <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    a: ({ children, href }) => {
      const isInternal = href?.startsWith('/')
      if (isInternal) {
        return (
          <Link href={href} className="font-medium text-blue-600 underline hover:text-blue-800">
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
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-slate-200 pl-6 italic text-slate-800 dark:border-slate-700 dark:text-slate-300">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
    img: (props) => (
      <Image
        className="rounded-lg border border-slate-200 dark:border-slate-700"
        alt={props.alt || ""}
        width={700}
        height={350}
        style={{ width: '100%', height: 'auto' }}
        {...props}
      />
    ),
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
          {children}
        </table>
      </div>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-slate-200 m-0 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-slate-200 p-2 text-left font-bold dark:border-slate-700">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border border-slate-200 p-2 text-left dark:border-slate-700">{children}</td>
    ),
    code: ({ children }) => (
      <code className="relative rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-white">
        {children}
      </pre>
    ),
    // Merge custom components with existing ones
    ...components,
  }
}