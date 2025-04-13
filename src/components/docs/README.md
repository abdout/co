# Documentation Components

This directory contains the components and utilities for the MDX documentation system.

## Key Components

- **docs-sidebar.tsx**: The sidebar navigation component that displays the hierarchical structure of documentation
- **docs-breadcrumb.tsx**: The breadcrumb component showing the current location in the documentation
- **constant.ts**: Data structure defining the sidebar hierarchy (items, subitems, activities)
- **generate-docs.js**: Script to generate MDX content files based on the sidebar data structure

## Recent Updates

The documentation system has been updated with the following improvements:

- **Next.js App Router integration**: Enhanced MDX rendering using the Next.js App Router and `next-mdx-remote/rsc`
- **Robust path resolution**: Expanded path matching to handle various file naming conventions and directory structures
- **Smart debugging**: Special debugging for problematic paths with detailed logging
- **Customized 404 handling**: User-friendly "not found" pages with clear path information
- **Recursive file search**: Fallback mechanism to find similarly named files when exact matches fail
- **ContentLayer removed**: Simplified architecture by removing ContentLayer dependency

## Usage

The documentation system is based on a hierarchical data structure defined in `constant.ts`. This structure is used to:

1. Generate the sidebar navigation
2. Create breadcrumb navigation 
3. Generate actual MDX files via the `generate-docs.js` script

### Updating Documentation

To add or modify documentation categories:

1. Update the `sidebarData` structure in `constant.ts`
2. Run the generation script:
   ```
   pnpm generate:docs
   ```
3. Edit the generated MDX files in the `content/docs` directory to add detailed content

### MDX File Structure

Documentation MDX files require the following frontmatter:

```yaml
---
title: Document Title
description: Brief description of the document
category: Top Level Category
subCategory: Second Level Category
activityName: Activity Name
---
```

These fields are used for both navigation and rendering metadata.

## File Organization

```
src/components/docs/         # Documentation components
├── docs-sidebar.tsx         # Sidebar navigation component
├── docs-breadcrumb.tsx      # Breadcrumb navigation component
├── constant.ts              # Data structure for docs hierarchy
├── generate-docs.js         # MDX file generator script
└── README.md                # This file

content/docs/                # Documentation content files
├── [category]/              # Top-level category directories
│   ├── [subcategory]/       # Second-level subcategory directories
│   │   └── [activity].mdx   # Activity documentation files
└── index.mdx                # Documentation home page
```

## Troubleshooting

If a documentation page isn't rendering:

1. Check the server logs for detailed path resolution information
2. Verify the file exists in the correct location within `content/docs/`
3. Ensure the MDX file has complete and correct frontmatter
4. Confirm the path matches the structure in `constant.ts` sidebar data

For the complete documentation system architecture, see the main project README.
