# Documentation Components

This directory contains the components and utilities for the MDX documentation system.

## Key Components

- **docs-sidebar.tsx**: The sidebar navigation component that displays the hierarchical structure of documentation
- **docs-breadcrumb.tsx**: The breadcrumb component showing the current location in the documentation
- **constant.ts**: Data structure defining the sidebar hierarchy (items, subitems, activities)
- **generate-docs.js**: Script to generate MDX content files based on the sidebar data structure

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

## File Organization

```
src/components/docs/         # Documentation components
├── docs-sidebar.tsx         # Sidebar navigation component
├── docs-breadcrumb.tsx      # Breadcrumb navigation component
├── constant.ts              # Data structure for docs hierarchy
├── generate-docs.js         # MDX file generator script
└── README.md                # This file
```

For the complete documentation system architecture, see the main project README.
