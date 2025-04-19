This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Documentation System

## Overview
A modern documentation system built with Next.js 14+, featuring native MDX support, dynamic routing, and a clean, maintainable structure. This system is designed to provide comprehensive documentation for electrical testing procedures and software tools.

## Directory Structure
```
src/
├── app/
│   └── docs/
│       ├── [[...slug]]/
│       │   └── page.tsx      # Dynamic documentation page
│       └── layout.tsx        # Documentation layout
├── components/
│   └── docs/                 # Documentation specific components
│       ├── constant.ts       # Documentation constants and navigation
│       ├── docs-sidebar.tsx  # Sidebar navigation component
│       ├── docs-header.tsx   # Documentation header component
│       ├── docs-layout.tsx   # Documentation layout wrapper
│       ├── docs-breadcrumb.tsx # Breadcrumb navigation
│       └── type.ts          # Documentation type definitions
├── content/                  # Documentation content
│   └── docs/                # Documentation MDX files
│       ├── transformer/     # Transformer documentation
│       ├── relay/          # Relay documentation
│       └── component/      # Component documentation
├── mdx-components.tsx      # Root MDX components configuration
└── lib/
    └── toc.ts             # Table of contents generation
```

## Setup

### 1. Install Dependencies
```bash
pnpm add -D @tailwindcss/typography @next/mdx @mdx-js/loader @mdx-js/react
```

### 2. Configure Tailwind
Update `tailwind.config.ts`:
```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
```

### 3. Configure Next.js
Make sure your `next.config.ts` includes:
```ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
  // ... other configuration
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
```

### 4. Create MDX Components
Define your MDX components in the root `src/mdx-components.tsx` file (required for Next.js native MDX support):

```tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-10 scroll-m-20 text-4xl font-bold tracking-tight">{children}</h1>
    ),
    // Add other component overrides
    ...components,
  }
}
```

### 5. Document Structure
Each MDX document should include:

```mdx
---
title: Document Title
description: Document description
---

# Title

Content with styled elements...
```

### 6. Development
```bash
pnpm dev
```

### 7. Build
```bash
pnpm build
```

## Important Note
This documentation system uses Next.js's native MDX support. It does NOT require or use `next-mdx-remote` package. The MDX files are directly processed by Next.js using `@next/mdx`. If you encounter any errors related to `next-mdx-remote`, please remove that package from dependencies.

## Styling Guidelines

### Typography
- Use Tailwind Typography plugin for consistent text styling
- Add `prose prose-slate dark:prose-invert` classes to the MDX wrapper
- All MDX content is styled through the components defined in `mdx-components.tsx`

### Table of Contents
- Automatically generated from page headings
- Displays in the right sidebar on large screens
- Highlights the currently active section while scrolling
- Uses headings IDs for anchor links

Implementation files:
```
src/
├── lib/
│   └── toc.ts              # Extracts headings from content
├── types/
│   └── toc.ts              # TOC type definitions
└── components/
    └── docs/
        └── table-of-contents.tsx  # TOC component with scroll tracking
```

### Code Blocks
- Style code blocks using the pre and code components in mdx-components.tsx
- Support for syntax highlighting through rehype-pretty-code plugin (optional)
- Add copy button functionality (optional)

## Usage Examples

### Standard Page
```mdx
---
title: Overcurrent Relay Testing
description: Learn how to test and commission overcurrent protection relays.
---

# Overcurrent Relay Testing

Introduction paragraph about overcurrent relays.

## Pickup Test
Instructions for conducting pickup tests.

## Timing Test
Instructions for conducting timing tests.

### Code Sample
```bash
# Command to run test
relay-test --type=overcurrent --mode=timing
```