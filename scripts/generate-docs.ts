import * as fs from 'fs';
import * as path from 'path';

// Base directories
const CONTENT_DIR = path.join(process.cwd(), 'content');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');

// Ensure directories exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Create a sample MDX file
const createMdxFile = (
  filePath: string, 
  title: string, 
  description: string, 
  category: string, 
  subCategory: string, 
  activityName: string
) => {
  const content = `---
title: ${title}
description: ${description}
category: ${category}
subCategory: ${subCategory}
activityName: ${activityName}
published: true
---

# ${title}

${description}

## Equipment Required

- Test equipment 1
- Test equipment 2
- Documentation for the specific equipment under test

## Procedure

1. **Step 1**
   - Substep 1.1
   - Substep 1.2
   - Substep 1.3

2. **Step 2**
   - Substep 2.1
   - Substep 2.2
   - Substep 2.3

## Safety Considerations

Always ensure proper safety procedures are followed before beginning maintenance.

## References

- Reference 1
- Reference 2
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created MDX file: ${filePath}`);
};

// Main function to generate docs
const generateDocs = () => {
  console.log('Generating documentation structure...');
  
  // Ensure base directories exist
  ensureDir(CONTENT_DIR);
  ensureDir(DOCS_DIR);
  
  // Create category directories and sample files
  const categories = [
    {
      name: 'relay',
      subcategories: [
        {
          name: 'overcurrent',
          activities: [
            { name: 'timing', title: 'Timing Test', description: 'Procedure for testing relay timing characteristics' },
            { name: 'pickup', title: 'Pickup Test', description: 'Procedure for testing relay pickup values' }
          ]
        },
        {
          name: 'differential',
          activities: [
            { name: 'operation', title: 'Operation Test', description: 'Procedure for testing differential relay operation' }
          ]
        }
      ]
    },
    {
      name: 'component',
      subcategories: [
        {
          name: 'circuit-breaker',
          activities: [
            { name: 'contact-resistance', title: 'Contact Resistance', description: 'Procedure for measuring circuit breaker contact resistance' },
            { name: 'timing', title: 'Timing Test', description: 'Procedure for testing circuit breaker timing' }
          ]
        }
      ]
    }
  ];
  
  // Generate the directory structure and files
  categories.forEach(category => {
    const categoryDir = path.join(DOCS_DIR, category.name);
    ensureDir(categoryDir);
    
    category.subcategories.forEach(subcategory => {
      const subcategoryDir = path.join(categoryDir, subcategory.name);
      ensureDir(subcategoryDir);
      
      subcategory.activities.forEach(activity => {
        const filePath = path.join(subcategoryDir, `${activity.name}.mdx`);
        createMdxFile(
          filePath, 
          activity.title, 
          activity.description, 
          category.name, 
          subcategory.name, 
          activity.name
        );
      });
    });
  });
  
  console.log('Documentation generation complete!');
};

// Execute
generateDocs(); 