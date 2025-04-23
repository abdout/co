#!/usr/bin/env node

/**
 * Script to generate index.mdx templates for documentation
 * 
 * Usage:
 * node generate-mdx-template.js <directory>
 * 
 * Example:
 * node generate-mdx-template.js src/content/docs/relay/undervolt
 */

const fs = require('fs');
const path = require('path');

// Get directory from command line args
const directoryArg = process.argv[2];

if (!directoryArg) {
  console.error('Please provide a directory path');
  process.exit(1);
}

// Get the directory name and parent directory name
const dirPath = path.resolve(directoryArg);
const dirName = path.basename(dirPath);
const parentDirName = path.basename(path.dirname(dirPath));

// Capitalize first letter and handle special abbreviations
function capitalize(string) {
  // Special case abbreviations map
  const abbreviations = {
    'oc': 'Overcurrent',
    'uv': 'Undervoltage',
    'uf': 'Underfrequency',
    'gen-prot': 'Generator Protection',
    'motor-prot': 'Motor Protection',
    'trafo-diff': 'Transformer Differential',
    'directional-oc': 'Directional Overcurrent',
    'earth-fault': 'Earth Fault'
  };

  // Check if string is in abbreviations map
  if (abbreviations[string.toLowerCase()]) {
    return abbreviations[string.toLowerCase()];
  }

  // Convert hyphenated words
  if (string.includes('-')) {
    return string.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Common activities for different parent directories
const commonActivities = {
  relay: ['pickup', 'timing', 'characteristic', 'insulation', 'burden'],
  transformer: ['ratio', 'polarity', 'insulation', 'winding-resistance', 'magnetizing-current'],
  // Add more as needed
};

// Equipment images from public/kit
const equipmentImages = [
  'freja300.png',
  'mit525.png',
  'sverker750.png',
  'dlro600.png'
];

// Template for index.mdx
function generateIndexTemplate() {
  const title = capitalize(dirName);
  const description = `${capitalize(dirName)} ${parentDirName} testing and commissioning`;
  
  // Get activities for this parent directory
  const activities = commonActivities[parentDirName.toLowerCase()] || [];

  // Generate equipment selection section with images from public/kit
  const equipmentSection = `
## Equipment Selection
<div className="flex flex-row gap-2 my-4 justify-start overflow-x-auto">
  <div className="border rounded-md p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
    <img src="/kit/${equipmentImages[0]}" alt="Test Equipment 1" className="w-20 h-20 object-contain" />
    <p className="text-center text-xs mt-1">${equipmentImages[0].replace('.png', '')}</p>
  </div>
  <div className="border rounded-md p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
    <img src="/kit/${equipmentImages[1]}" alt="Test Equipment 2" className="w-20 h-20 object-contain" />
    <p className="text-center text-xs mt-1">${equipmentImages[1].replace('.png', '')}</p>
  </div>
  <div className="border rounded-md p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
    <img src="/kit/${equipmentImages[2]}" alt="Test Equipment 3" className="w-20 h-20 object-contain" />
    <p className="text-center text-xs mt-1">${equipmentImages[2].replace('.png', '')}</p>
  </div>
  <div className="border rounded-md p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
    <img src="/kit/${equipmentImages[3]}" alt="Test Equipment 4" className="w-20 h-20 object-contain" />
    <p className="text-center text-xs mt-1">${equipmentImages[3].replace('.png', '')}</p>
  </div>
</div>`;

  // Generate model selection with badges from UI components
  const modelSection = `
## Model Selection
<div className="flex flex-wrap gap-2 my-6">
  <Badge className="cursor-pointer bg-blue-500 hover:bg-blue-600">ABB REF615</Badge>
  <Badge className="cursor-pointer bg-green-500 hover:bg-green-600">Siemens 7SJ82</Badge>
  <Badge className="cursor-pointer bg-red-500 hover:bg-red-600">SEL-751</Badge>
  <Badge className="cursor-pointer bg-purple-500 hover:bg-purple-600">GE Multilin 750</Badge>
  <Badge className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black">Schneider P14D</Badge>
  <Badge className="cursor-pointer bg-gray-500 hover:bg-gray-600">Micom P122</Badge>
</div>`;
  
  // Generate detailed activity sections directly in the index file
  let activitySections = '';
  if (activities.length > 0) {
    activities.forEach(activity => {
      const activityTitle = capitalize(activity);
      activitySections += `
## ${activityTitle} Test

### Test Procedure

This section describes the detailed procedure for performing the ${activityTitle.toLowerCase()} test on ${title.toLowerCase()} ${parentDirName}.

#### Preparation
- Review the relay settings and manufacturer documentation
- Gather necessary test equipment and tools
- Ensure all safety precautions are in place

#### Connection Setup
- Connect the test equipment according to the circuit diagram
- Verify all connections before applying test signals

#### Testing Steps
1. Configure the test equipment with appropriate parameters
2. Apply test signals according to the procedure
3. Record the test results
4. Analyze the results against acceptance criteria

### Circuit Diagram

\`\`\`
+----------------+     +---------------+     +----------------+
| Test Equipment |---->| Test Setup    |---->| Device Under   |
|                |     |               |     | Test           |
+----------------+     +---------------+     +----------------+
\`\`\`

### Acceptance Criteria

| Parameter | Acceptable Range | Units |
|-----------|------------------|-------|
| Example 1 | 95-105%          | %     |
| Example 2 | < 100            | ms    |

### Tools Used

- Test equipment: Appropriate relay test set
- Hand tools: Insulated screwdrivers, multimeter
- Safety equipment: Insulated gloves, safety glasses

`;
    });
  }

  return `import { Badge } from "@/components/ui/badge"

---
title: ${title}
description: ${description}
---

# ${title}

${equipmentSection}

${modelSection}

## Overview
This section provides comprehensive information about ${title.toLowerCase()} ${parentDirName} testing and commissioning procedures. It includes detailed test methods, circuit diagrams, acceptance criteria, and troubleshooting guidelines for effective testing and maintenance.

## Precautions
- Ensure all testing personnel are qualified and familiar with the equipment
- Verify circuit isolation before commencing tests
- Use appropriate PPE (Personal Protective Equipment)
- Follow all safety protocols specific to the testing environment
- Double-check connections before applying test voltages/currents

${activitySections}`;
}

// Template for activity pages
function generateActivityTemplate(activityName) {
  const title = `${capitalize(dirName)} ${capitalize(activityName)} Testing`;
  
  return `---
title: ${title}
description: Test procedure for ${activityName} testing of ${dirName} ${parentDirName}
---

# ${title}

## Test Procedure

### Preparation

### Connection Setup

### Testing Procedure

### Data Analysis

## Circuit Diagram

\`\`\`
+----------------+     +---------------+     +----------------+
| Test Equipment |---->| Test Setup    |---->| Device Under   |
|                |     |               |     | Test           |
+----------------+     +---------------+     +----------------+
\`\`\`

## Acceptance Criteria

| Parameter | Acceptable Range | Units |
|-----------|------------------|-------|
|           |                  |       |
|           |                  |       |

## Tools Used

### Test Equipment

### Hand Tools

### Safety Equipment

## Appendix

### Troubleshooting Guide

### Documentation Template
`;
}

// Generate index.mdx file
const indexPath = path.join(dirPath, 'index.mdx');
const indexContent = generateIndexTemplate();

// Check if directory exists
if (!fs.existsSync(dirPath)) {
  console.log(`Creating directory: ${dirPath}`);
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write or update index.mdx
fs.writeFileSync(indexPath, indexContent);
console.log(`Generated index.mdx at ${indexPath}`);

// Generate activity files if parent directory has common activities
if (commonActivities[parentDirName]) {
  for (const activity of commonActivities[parentDirName]) {
    const activityPath = path.join(dirPath, `${activity}.mdx`);
    
    // Only create if file doesn't exist
    if (!fs.existsSync(activityPath)) {
      const activityContent = generateActivityTemplate(activity);
      fs.writeFileSync(activityPath, activityContent);
      console.log(`Generated ${activity}.mdx at ${activityPath}`);
    } else {
      console.log(`File already exists: ${activityPath}`);
    }
  }
}

console.log('Template generation complete!'); 