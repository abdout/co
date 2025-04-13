# Documentation System

This documentation system provides maintenance procedures and technical guidelines for various electrical equipment categories including Relays, Components, Transformers, and Switchgear systems.

## Architecture

The documentation is organized hierarchically:
- **Category**: Top-level grouping (e.g., Relay, Component, Transformer)
- **Subcategory**: Equipment type within a category (e.g., Overcurrent, Circuit Breaker)
- **Activity**: Specific maintenance procedure (e.g., Contact Resistance, Insulation Testing)

## File Structure

```
src/
├── app/
│   └── (platform)/
│       └── docs/
│           ├── [[...slug]]/
│           │   └── page.tsx   # Dynamic route handler
│           └── layout.tsx     # Documentation layout
├── components/
│   └── template/
│       └── sidebar/
│           ├── constant.ts    # Sidebar data
│           ├── docs-sidebar.tsx
│           └── sidebar.tsx    # Core sidebar component
└── content/
    └── docs/                  # MDX content files
        ├── [category]/
        │   └── [subcategory]/
        │       └── [activity].mdx
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 

### Running the Documentation Locally

1. Install dependencies:
   ```
   pnpm install
   ```

2. Generate documentation content:
   ```
   pnpm generate-docs
   ```

3. Start the development server:
   ```
   pnpm dev
   ```

4. Access the documentation at `http://localhost:3000/docs`

## Adding New Documentation

1. Create new MDX files in the `content/docs/[category]/[subcategory]/` directory
2. Follow the template structure:
   ```mdx
   ---
   title: Activity Name
   description: Brief description of the activity
   category: Category Name
   subCategory: Subcategory Name
   activityName: Activity Name
   ---

   # Activity Title

   Content goes here...
   ```

3. Update the sidebar data in `src/components/template/sidebar/constant.ts` if needed

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Nested Navigation**: Hierarchical sidebar navigation
- **Persistent State**: Sidebar state is stored in cookies
- **Keyboard Shortcuts**: Press `Ctrl+B` to toggle sidebar
- **MDX Support**: Use Markdown with React components
- **Scroll-Aware UI**: Headers collapse on scroll for optimal viewing

## Content Guidelines

- Use clear, concise language
- Include step-by-step procedures
- Add relevant images/diagrams when possible
- Use consistent formatting
- Include safety warnings where applicable

## Troubleshooting

If documentation isn't appearing:
1. Ensure ContentLayer is properly configured
2. Run `pnpm generate-docs` to create MDX files
3. Check the console for any errors
4. Verify that the path in the URL matches the expected structure

### Debugging with Console Logs

If you're seeing the "Documentation system is almost ready!" message for a specific path like `relay/overcurrent/timing`, add these console logs to debug:

1. In `src/app/(platform)/docs/[[...slug]]/page.tsx`:
   ```tsx
   console.log('Slug params:', params);
   console.log('Available MDX docs:', allDocs.map(doc => doc._id));
   console.log('Matched document:', doc);
   ```

2. In ContentLayer configuration (usually `contentlayer.config.ts`):
   ```tsx
   console.log('ContentLayer building docs from:', contentDirPath);
   console.log('Generated docs:', generatedDocs);
   ```

3. Check browser console and server logs for these outputs and verify:
   - The slug is being parsed correctly
   - ContentLayer is generating the expected documents
   - The file exists in the expected location with the correct frontmatter
