import { System, Category, Activity } from "../types";

interface LegacyActivity {
  system: string;
  category: string;
  activity: string;
}

/**
 * Converts the legacy flat activities structure to the new hierarchical structure
 */
export function convertLegacyActivities(
  systemNames: string[],
  legacyActivities: LegacyActivity[]
): System[] {
  const systemsMap = new Map<string, System>();

  // Initialize systems from the list of system names
  systemNames.forEach(systemName => {
    systemsMap.set(systemName, {
      name: systemName,
      categories: []
    });
  });

  // Process all activities
  legacyActivities.forEach(legacyActivity => {
    const { system: systemName, category: categoryName, activity: activityName } = legacyActivity;
    
    // Get or create system
    if (!systemsMap.has(systemName)) {
      systemsMap.set(systemName, {
        name: systemName,
        categories: []
      });
    }
    const system = systemsMap.get(systemName)!;
    
    // Find category or create it
    let category = system.categories.find(cat => cat.name === categoryName);
    if (!category) {
      category = {
        name: categoryName,
        activities: []
      };
      system.categories.push(category);
    }
    
    // Add activity if it doesn't exist already
    if (!category.activities.some(act => act.name === activityName)) {
      category.activities.push({
        name: activityName,
        status: "pending"
      });
    }
  });

  return Array.from(systemsMap.values());
}

/**
 * Converts the hierarchical structure back to the legacy format for
 * backward compatibility during transition
 */
export function convertToLegacyFormat(systems: System[]): {
  systemNames: string[];
  activities: LegacyActivity[];
} {
  const systemNames = systems.map(system => system.name);
  const activities: LegacyActivity[] = [];

  systems.forEach(system => {
    system.categories.forEach(category => {
      category.activities.forEach(activity => {
        activities.push({
          system: system.name,
          category: category.name,
          activity: activity.name
        });
      });
    });
  });

  return {
    systemNames,
    activities
  };
} 