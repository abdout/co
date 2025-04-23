# MDX Documentation Enhancement Plan

This document outlines a plan to enhance the current MDX documentation system to better align with Next.js best practices, while maintaining the existing functionality and appearance.

## Current Implementation Analysis

### 1. MDX Content Processing
- **Current Approach**: Uses a custom `mdxToHtml` function in `src/app/docs/[[...slug]]/page.tsx` that manually parses MDX and converts it to HTML
- **Rendering Method**: Renders MDX content using `dangerouslySetInnerHTML` with HTML strings
- **Styling**: Uses Tailwind Typography's `prose` classes for styling the rendered HTML

### 2. Directory Structure
- **Content Location**: MDX files stored in `src/content/docs`
- **MDX Components**: Placeholder file exists at `src/mdx-components.tsx` but isn't being fully utilized yet
- **Layout**: Uses `src/app/docs/layout.tsx` for wrapping documentation pages

### 3. Features
- **Table of Contents**: Generated from headings in MDX content
- **Frontmatter**: Supports title and description metadata
- **Custom Components**: Has some custom components like RelayEquipmentDisplay, EquipmentImages, and now Callout

## Progress Update

### Completed Tasks:
1. **Custom MDX Components Implementation**:
   - Created a custom Callout component in `src/components/mdx/custom-callout.tsx`
   - Component supports different types (info, warning, error) with appropriate styling
   - Created example MDX file demonstrating usage in `src/content/docs/example.mdx`

2. **Test Implementation**:
   - Created a test page at `src/app/docs/test-mdx/page.tsx` for transition testing
   - Created an MDX import example at `src/app/docs/mdx-import-example/page.tsx`

3. **Component Architecture**:
   - Implemented proper component architecture with type definitions
   - Styled components using Tailwind with conditional classes

## Comparison with Official Next.js Recommendation

| Feature | Current Implementation | Official Recommendation | Status |
|---------|------------------------|-------------------------|--------|
| MDX Processing | Custom HTML parser | Using built-in Next.js MDX support | In progress |
| Component Styling | Tailwind Typography | MDX components with custom styling | Partially implemented |
| Layout | Standard layout component | Shared layout for MDX content | In progress |
| Component Overrides | Manual in HTML parser | Via `mdx-components.tsx` | Partially implemented |
| Configuration | Manual parsing | `@next/mdx` with proper plugin configuration | In progress |
| Custom Components | Limited | Full React component support | Implemented Callout component |

## Enhancement Plan

### 1. Configure Next.js for MDX properly

**Current Status**: Need to verify if `next.config.ts` has proper MDX configuration.

**Enhancement**:
- Ensure `@next/mdx` is properly configured
- Verify pageExtensions includes `.mdx`
- Add any necessary remark/rehype plugins

```typescript
// next.config.ts example configuration
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // ... other config
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

### 2. Continue Implementing mdx-components.tsx

**Current Status**: File exists with some components but needs to be integrated with custom components like Callout.

**Enhancement**:
- Update `mdx-components.tsx` to include the new Callout component
- Ensure all MDX elements have proper styling definitions
- Test integration with custom components

```typescript
// Example of updated mdx-components.tsx with Callout
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'
import { RelayEquipmentDisplay } from './components/docs/RelayEquipmentDisplay'
import EquipmentImages from './components/docs/EquipmentImages'
import { Callout } from './components/mdx/custom-callout'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components
    RelayEquipmentDisplay,
    EquipmentImages,
    Callout,
    
    // Standard HTML elements with styling
    h1: ({ children }) => (
      <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">{children}</h2>
    ),
    // ... define styling for all other elements
    
    // Merge with passed components
    ...components,
  }
}
```

### 3. Update Page Rendering (Phased Approach)

**Current Status**: Implementation in progress with test pages.

**Enhancement Plan**:
1. **Phase 1**: ✅ Test pages created for development
   - ✅ `src/app/docs/test-mdx/page.tsx` created for transition testing
   - ✅ `src/app/docs/mdx-import-example/page.tsx` created to demonstrate import approach

2. **Phase 2**: Continue parallel implementation using proper MDX imports
   - Further develop test pages with direct MDX imports
   - Test with example.mdx and other MDX files
   - Compare output with current implementation

3. **Phase 3**: Test with a small subset of documentation
   - Select a few representative documentation pages
   - Implement and test with the new approach
   - Verify visual appearance and functionality

4. **Phase 4**: Switch fully to the new implementation
   - Once confident in the new approach, update the main page component
   - Remove the custom HTML parser
   - Deploy and test thoroughly

### 4. Create More Custom MDX Components

**Current Status**: Callout component implemented, need more custom components.

**Enhancement**:
- Create additional custom components as needed:
  - Code block with copy button
  - Tabbed interface
  - Interactive demos
  - Image with caption
- Add these components to `mdx-components.tsx`
- Create examples for each component

### 5. Implement Proper Layout Integration

**Current Status**: Uses a layout component but doesn't properly integrate with MDX components.

**Enhancement**:
- Update layout to work with the MDX component system
- Keep the same visual design and structure
- Apply styling through components rather than global prose classes

## Implementation Strategy

### 1. Non-Disruptive Development
- ✅ Started creating test pages for development
- Continue developing components and configuration in parallel
- Don't modify existing code until ready for testing

### 2. Testing Approach
- ✅ Created example.mdx for testing
- Continue testing with more documentation files
- Verify visual appearance matches current implementation
- Check all features (ToC, custom components, etc.) work properly

### 3. Gradual Transition
- Maintain backward compatibility
- Implement feature parity before switching
- Consider a hybrid approach during transition if necessary

## Updated Timeline and Milestones

1. **Week 1**: ✅ Research and Planning
   - ✅ Review current implementation in detail
   - ✅ Finalize enhancement plan
   - ✅ Set up development environment

2. **Week 2**: Basic Implementation (In Progress)
   - ✅ Create initial custom components (Callout)
   - ✅ Create test pages
   - Configure Next.js for MDX
   - Update mdx-components.tsx

3. **Week 3**: Feature Implementation
   - Create additional custom components
   - Implement Table of Contents with new approach
   - Handle frontmatter

4. **Week 4**: Testing and Refinement
   - Test with actual documentation
   - Refine styling and components
   - Address any issues

5. **Week 5**: Transition
   - Finalize implementation
   - Switch to new approach
   - Deploy and monitor

## Conclusion

This enhancement plan is progressing well with the implementation of custom MDX components like Callout. The phased approach is working effectively, allowing for structured improvements to the MDX documentation system while maintaining the current functionality and appearance. By continuing to follow the official Next.js MDX recommendations, the documentation system will be more maintainable, extensible, and aligned with modern best practices. 