# Documentation Content

This directory contains all the MDX content files for the documentation system.

## Directory Structure

```
docs/
├── component/       # Component documentation
├── relay/          # Relay documentation
│   ├── overcurrent/ # Overcurrent relay documentation
│   ├── distance/    # Distance relay documentation
│   └── ...
├── transformer/    # Transformer documentation
└── ...
```

## MDX File Structure

Each documentation section follows a standard layout:

### Index Files (`index.mdx`)

The index.mdx file now contains everything needed for a specific documentation section with the following structure:

```
import { Badge } from "@/components/ui/badge"

---
title: [Directory Name]
description: [Directory Name] [Parent Directory] testing and commissioning
---

# [Directory Name]

## Equipment Selection
- Four test equipment images in a single compact row from /public/kit/

## Model Selection
- Badge components to select relay/device models

## Overview
- Overview of the testing and commissioning procedures

## Precautions
- Safety precautions and prerequisites

## [Activity 1] Test
### Test Procedure
- Detailed procedures
### Circuit Diagram
- Circuit connection details
### Acceptance Criteria  
- Test acceptance criteria
### Tools Used
- Required equipment and tools

## [Activity 2] Test
...and so on for each test activity
```

## Generating Templates

A script is available to generate standard templates for new documentation sections:

```bash
# Make the script executable
chmod +x src/scripts/generate-mdx-template.js

# Generate templates for a new section
node src/scripts/generate-mdx-template.js src/content/docs/relay/new-relay-type
```

This will:
1. Create the directory if it doesn't exist
2. Generate an `index.mdx` file with the complete standard layout including all test activities
3. Generate individual activity files for reference (though these are now also included in the index file)

## Customizing Templates

After generating templates, you should:

1. Update the overview section with specific information
2. Select appropriate equipment images from the `/public/kit/` directory (displayed in a single compact row)
3. Customize the model badges with relevant devices
4. Fill in the content for each test activity section

## Images and UI Components

- Test equipment images are sourced from `/public/kit/` and displayed in a compact single row
- Model selection uses badges from the UI component library
- All UI components should be imported at the top of the MDX file before the frontmatter

## Images

Equipment and model images should be placed in:
- `/public/images/equipment/` - for test equipment images
- `/public/images/models/` - for device model images 