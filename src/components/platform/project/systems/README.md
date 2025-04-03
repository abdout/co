# Systems, Categories, and Activities

This folder contains components for managing systems, categories, and activities in a hierarchical structure.

## Data Structure

The data is organized in a hierarchical structure:

```
Project
└── Systems (e.g., "HV SWGR", "MV SWGR")
    └── Categories (e.g., "Circuit Breaker", "General", "Overcurrent")
        └── Activities (e.g., "Contact Resist.", "Timing Open-Close")
```

## Components

- `Systems`: The main container component that displays tabs for each system
- `SystemComponent`: Displays categories for a specific system
- `CategoryComponent`: Displays activities for a specific category

## Converting Legacy Data

You can use the utility functions to convert legacy data to the new hierarchical structure:

```tsx
import { convertLegacyActivities } from "@/components/platform/project/systems";

// Convert legacy data
const hierarchicalSystems = convertLegacyActivities(
  project.systems, // Array of system names ["HV SWGR", "MV SWGR"]
  project.activities // Array of activities with system, category, activity properties
);

// Convert back to legacy format if needed
import { convertToLegacyFormat } from "@/components/platform/project/systems";
const { systemNames, activities } = convertToLegacyFormat(hierarchicalSystems);
```

## Usage Example

```tsx
import { Systems } from "@/components/platform/project/systems";
import { convertLegacyActivities } from "@/components/platform/project/systems";

function ProjectDetails({ project }) {
  // Convert legacy data to hierarchical structure
  const [systems, setSystems] = useState(() => 
    convertLegacyActivities(project.systems, project.activities)
  );

  const handleSystemsUpdate = (updatedSystems) => {
    setSystems(updatedSystems);
    // You can convert back to legacy format for saving if needed
  };

  return (
    <div>
      <Systems 
        systems={systems}
        onUpdate={handleSystemsUpdate}
      />
    </div>
  );
} 