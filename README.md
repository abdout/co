This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Documentation System

## Overview
A modern documentation system built with Next.js 14, featuring MDX support, dynamic routing, and a clean, maintainable structure.

## Directory Structure
```
.
├── src/
│   ├── app/
│   │   ├── docs/
│   │   │   ├── [[...slug]]/
│   │   │   │   └── page.tsx        # Dynamic documentation page component
│   │   │   └── layout.tsx          # Documentation layout
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── components/
│   │   ├── docs/
│   │   │   ├── constant.ts         # Documentation constants
│   │   │   ├── docs-sidebar.tsx    # Sidebar navigation
│   │   │   ├── docs-toc.tsx        # Table of contents
│   │   │   └── type.ts             # Documentation types
│   │   ├── ui/                     # Shared UI components
│   │   │   ├── button.tsx
│   │   │   ├── collapsible.tsx
│   │   │   └── scroll-area.tsx
│   │   ├── mdx-components.tsx      # MDX component definitions
│   │   ├── pager.tsx              # Documentation pager
│   │   └── toc.tsx                # Table of contents
│   ├── config/
│   │   └── docs.ts                # Documentation configuration
│   ├── lib/
│   │   ├── utils.ts               # Utility functions
│   │   └── toc.ts                 # TOC generation utilities
│   ├── styles/
│   │   └── globals.css            # Global styles
│   └── types/
│       └── nav.ts                 # Navigation type definitions
├── content/
│   └── docs/                      # Documentation content
│       ├── index.mdx              # Documentation home
│       └── [category]/
│           ├── index.mdx          # Category landing
│           └── [doc].mdx          # Documentation pages
├── public/                        # Static assets
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features
- 📝 MDX Support with custom components
- 🌳 Dynamic routing for documentation pages
- 📚 Sidebar navigation with collapsible categories
- 📋 Automatic table of contents generation
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔍 SEO-friendly metadata
- 🚀 Static site generation
- 🔄 Hot reload during development

## Writing Documentation

### Frontmatter Fields
```mdx
---
title: Document Title
description: Document description
category: Category Name
tags: [tag1, tag2]
---
```

### Available Components
- All standard MDX components
- Custom UI components
- Code blocks with syntax highlighting
- Tables with responsive design
- Images with optimization

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
