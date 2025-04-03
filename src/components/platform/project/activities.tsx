import { useState, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type Control } from "react-hook-form";
import { type ProjectFormValues } from "./validation";
import { activities } from "./constant";
import { type Systems, type ActivityWithSystem } from "./types";
import { cn } from "@/lib/utils";

// Add type definitions
interface CategoryActivities {
  activities: string[];
}

interface SystemActivities {
  items: {
    [key: string]: CategoryActivities;
  };
}

interface ActivitiesTabProps {
  control: Control<ProjectFormValues>;
  selectedSystems: Systems[];
  selectedActivities: ActivityWithSystem[];
  selectedCategories: Record<Systems, string[]>;
  selectedSubcategories: Record<Systems, Record<string, string[]>>;
  activeSystemTab: Systems | null;
  onSystemToggle: (system: Systems) => void;
  onActivityChange: (system: Systems, category: string, subcategory: string, activity: string, checked: boolean) => void;
  onSelectAllActivities: (system: Systems, category: string, subcategory: string | null, activities: ActivityWithSystem[]) => void;
  onUnselectAllActivities: (system: Systems, category: string, subcategory: string | null) => void;
  onCategoryToggle: (system: Systems, category: string) => void;
  onSubcategoryToggle: (system: Systems, category: string, subcategory: string) => void;
  setActiveSystemTab: (system: Systems | null) => void;
}

export function ActivitiesTab({
  control,
  selectedSystems,
  selectedActivities,
  selectedCategories,
  selectedSubcategories,
  activeSystemTab,
  onSystemToggle,
  onActivityChange,
  onSelectAllActivities,
  onUnselectAllActivities,
  onCategoryToggle,
  onSubcategoryToggle,
  setActiveSystemTab
}: ActivitiesTabProps) {
  const systemOptions: Systems[] = ['MV SWGR', 'HV SWGR', 'LV SWGR', 'POWER TRAFO', 'DIST. TRAFO', 'COMPONENT', 'RELAY', 'RMU', 'LOW CURRENT'];

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Activities</h2>
      <div className="rounded-lg bg-muted/20">
        {/* System Selection */}
        <div className="space-y-4 mb-4">
          <FormLabel className="text-sm font-medium">Systems</FormLabel>
          <FormMessage>{control._formState.errors.systems?.message}</FormMessage>
          <div className="flex flex-wrap gap-4">
            {systemOptions.map((system) => (
              <Button
                key={system} 
                type="button"
                variant="outline"
                className={cn(
                  "transition-opacity text-xs px-2 py-1",
                  selectedSystems.includes(system) 
                    ? "opacity-100 border-primary bg-primary/10" 
                    : "opacity-70 hover:opacity-100"
                )}
                onClick={() => onSystemToggle(system)}
              >
                {system}
              </Button>
            ))}
          </div>
        </div>

        {/* Activities Selection - shown only if systems are selected */}
        {selectedSystems.length > 0 && (
          <div className="space-y-4 pt-4">
            <FormLabel className="text-sm font-medium">Activities</FormLabel>
            <FormMessage>{control._formState.errors.activities?.message}</FormMessage>
            
            <Tabs 
              value={activeSystemTab || undefined} 
              onValueChange={(value) => setActiveSystemTab(value as Systems)}
              className="w-full"
            >
              <TabsList className="mb-4 w-full justify-start overflow-auto">
                {selectedSystems.map((system) => (
                  <TabsTrigger key={system} value={system}>
                    {system}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {selectedSystems.map((system) => (
                <TabsContent key={system} value={system} className="mt-2">
                  {/* Equipment Categories Selection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Select Equipment Types:</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.keys(activities[system].items).map((category) => (
                        <div 
                          key={`${system}-category-${category}`} 
                          className={cn(
                            "flex items-center px-3 py-1.5 rounded-md space-x-2 cursor-pointer transition-colors",
                            selectedCategories[system]?.includes(category) 
                              ? "bg-primary/20 border border-primary/50" 
                              : "bg-muted/50 hover:bg-muted/80"
                          )}
                          onClick={() => onCategoryToggle(system, category)}
                        >
                          <label
                            className="text-sm font-medium cursor-pointer w-full"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Only show categories that are selected */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(activities[system].items)
                      .filter(([category]) => selectedCategories[system]?.includes(category))
                      .map(([category, categoryActivities]: [string, { activities: string[] }]) => (
                        <Accordion 
                          key={`${system}-${category}-accordion`} 
                          type="multiple" 
                          className={cn(
                            "w-full",
                            (system === 'MV SWGR' || system === 'HV SWGR') && category === "Relay" ? "md:col-span-2" : ""
                          )}
                        >
                          <AccordionItem 
                            value={`${system}-${category}`} 
                            className="border-b border-muted/60"
                          >
                            <AccordionTrigger className="font-semibold hover:bg-muted/20 px-4 rounded-md">
                              {category}
                            </AccordionTrigger>
                            <AccordionContent>
                              {category === "Relay" ? (
                                <>
                                  {/* Subcategory Selection for Relay */}
                                  <div className="mb-6">
                                    <h4 className="text-sm font-medium mb-2">Select {category} Types:</h4>
                                    <div className="flex flex-wrap gap-3">
                                      {Object.keys(categoryActivities).map((subcategory) => (
                                        <div 
                                          key={`${system}-${category}-subcategory-${subcategory}`} 
                                          className={cn(
                                            "flex items-center px-3 py-1.5 rounded-md space-x-2 cursor-pointer transition-colors",
                                            selectedSubcategories[system]?.[category]?.includes(subcategory)
                                              ? "bg-primary/20 border border-primary/50" 
                                              : "bg-muted/50 hover:bg-muted/80"
                                          )}
                                          onClick={() => onSubcategoryToggle(system, category, subcategory)}
                                        >
                                          <label className="text-sm font-medium cursor-pointer w-full">
                                            {subcategory}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Show only selected subcategories for Relay */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {Object.entries(categoryActivities)
                                      .filter(([subcategory]) => selectedSubcategories[system]?.[category]?.includes(subcategory))
                                      .map(([subcategory, subcategoryActivities]) => (
                                        <div key={`${system}-${category}-${subcategory}`} className="space-y-2 p-3 rounded-md bg-muted/10 hover:bg-muted/20">
                                          <h4 className="text-sm font-medium">{subcategory}</h4>
                                          <div className="space-y-1">
                                            {((subcategoryActivities as unknown) as string[]).map((activity: string) => {
                                              const isSelected = selectedActivities.some(
                                                a => a.system === system &&
                                                    a.category === category && 
                                                    a.subcategory === subcategory && 
                                                    a.activity === activity
                                              );
                                              return (
                                                <div 
                                                  key={`${system}-${category}-${subcategory}-${activity}`} 
                                                  className={cn(
                                                    "flex items-center px-3 py-1.5 rounded-md",
                                                    isSelected ? "bg-primary/20" : "bg-muted/50 hover:bg-muted/80"
                                                  )}
                                                >
                                                  <div className="flex items-center w-full">
                                                    <Checkbox
                                                      id={`${system}-${category}-${subcategory}-${activity}`}
                                                      checked={isSelected}
                                                      onCheckedChange={(checked) => {
                                                        onActivityChange(
                                                          system,
                                                          category,
                                                          subcategory,
                                                          activity,
                                                          !!checked
                                                        );
                                                      }}
                                                      onClick={(e) => e.stopPropagation()}
                                                      className="mr-2"
                                                    />
                                                    <label
                                                      htmlFor={`${system}-${category}-${subcategory}-${activity}`}
                                                      className="text-sm cursor-pointer flex-1"
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      {activity}
                                                    </label>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  
                                  {/* Show message if no subcategories selected for Relay */}
                                  {(!selectedSubcategories[system]?.[category]?.length) && (
                                    <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-md">
                                      Please select at least one {category.toLowerCase()} type to see available activities
                                    </div>
                                  )}
                                </>
                              ) : (
                                // For non-Relay items, show activities directly
                                <div className="space-y-4">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newActivities: ActivityWithSystem[] = [];
                                        (categoryActivities.activities || []).forEach((activity: string) => {
                                          newActivities.push({
                                            system,
                                            category,
                                            subcategory: category,
                                            activity
                                          });
                                        });
                                        onSelectAllActivities(system, category, null, newActivities);
                                      }}
                                      className="text-xs"
                                    >
                                      Select All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onUnselectAllActivities(system, category, null);
                                      }}
                                      className="text-xs"
                                    >
                                      Unselect All
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {(categoryActivities.activities || []).map((activity: string) => {
                                      const isSelected = selectedActivities.some(
                                        a => a.system === system &&
                                            a.category === category && 
                                            a.subcategory === category && 
                                            a.activity === activity
                                      );
                                      return (
                                        <div 
                                          key={`${system}-${category}-${activity}`} 
                                          className={cn(
                                            "flex items-center px-3 py-1.5 rounded-md",
                                            isSelected ? "bg-primary/20" : "bg-muted/50 hover:bg-muted/80"
                                          )}
                                        >
                                          <div className="flex items-center w-full">
                                            <Checkbox
                                              id={`${system}-${category}-${activity}`}
                                              checked={isSelected}
                                              onCheckedChange={(checked) => {
                                                onActivityChange(
                                                  system,
                                                  category,
                                                  category,
                                                  activity,
                                                  !!checked
                                                );
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                              className="mr-2"
                                            />
                                            <label
                                              htmlFor={`${system}-${category}-${activity}`}
                                              className="text-sm cursor-pointer flex-1"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {activity}
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
} 