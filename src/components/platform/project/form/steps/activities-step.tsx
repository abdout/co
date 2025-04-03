'use client';

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { sidebarData } from '@/components/template/sidebar/constant';
import type { ProjectFormValues } from '@/schemas/project';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

type SystemType = 'LV' | 'MV' | 'HV' | 'EHV';
type ActivityWithSystem = {
  system: SystemType;
  category: string;
  subcategory: string;
  activity: string;
};

interface ActivitiesStepProps {
  form: UseFormReturn<ProjectFormValues>;
  selectedSystems: SystemType[];
  setSelectedSystems: React.Dispatch<React.SetStateAction<SystemType[]>>;
  selectedActivities: ActivityWithSystem[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<ActivityWithSystem[]>>;
  activeSystemTab: SystemType | null;
  setActiveSystemTab: React.Dispatch<React.SetStateAction<SystemType | null>>;
  selectedCategories: Record<SystemType, string[]>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Record<SystemType, string[]>>>;
}

export default function ActivitiesStep({ 
  form,
  selectedSystems,
  setSelectedSystems,
  selectedActivities,
  setSelectedActivities,
  activeSystemTab,
  setActiveSystemTab,
  selectedCategories,
  setSelectedCategories
}: ActivitiesStepProps) {
  
  // Track selected subcategories per system and category
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<SystemType, Record<string, string[]>>>({
    'LV': {},
    'MV': {},
    'HV': {},
    'EHV': {},
  });
  
  const handleSystemToggle = useCallback((system: SystemType) => {
    setSelectedSystems(prev => {
      if (prev.includes(system)) {
        // If system is already selected, remove it and all its activities
        setSelectedActivities(activities => 
          activities.filter(activity => activity.system !== system)
        );
        // Clear selected categories for this system
        setSelectedCategories(prev => ({
          ...prev,
          [system]: []
        }));
        // Clear selected subcategories for this system
        setSelectedSubcategories(prev => ({
          ...prev,
          [system]: {}
        }));
        return prev.filter(s => s !== system);
      } else {
        // If system is not yet selected, add it
        return [...prev, system];
      }
    });
  }, [setSelectedSystems, setSelectedActivities, setSelectedCategories, setSelectedSubcategories]);

  const handleCategoryToggle = useCallback((system: SystemType, category: string) => {
    setSelectedCategories(prev => {
      const systemCategories = prev[system] || [];
      if (systemCategories.includes(category)) {
        // Remove category and filter out related activities
        setSelectedActivities(activities => 
          activities.filter(a => !(a.system === system && a.category === category))
        );
        // Clear selected subcategories for this category
        setSelectedSubcategories(prev => ({
          ...prev,
          [system]: {
            ...prev[system],
            [category]: []
          }
        }));
        return {
          ...prev,
          [system]: systemCategories.filter(c => c !== category)
        };
      } else {
        // Add category
        return {
          ...prev,
          [system]: [...systemCategories, category]
        };
      }
    });
  }, [setSelectedCategories, setSelectedActivities, setSelectedSubcategories]);

  const handleSubcategoryToggle = useCallback((system: SystemType, category: string, subcategory: string) => {
    setSelectedSubcategories(prev => {
      const categorySubcategories = prev[system]?.[category] || [];
      if (categorySubcategories.includes(subcategory)) {
        // Remove subcategory and filter out related activities
        setSelectedActivities(activities => 
          activities.filter(a => !(a.system === system && a.category === category && a.subcategory === subcategory))
        );
        return {
          ...prev,
          [system]: {
            ...prev[system],
            [category]: categorySubcategories.filter(s => s !== subcategory)
          }
        };
      } else {
        // Add subcategory
        return {
          ...prev,
          [system]: {
            ...prev[system],
            [category]: [...categorySubcategories, subcategory]
          }
        };
      }
    });
  }, [setSelectedSubcategories, setSelectedActivities]);

  const handleActivitySelect = useCallback((system: SystemType, category: string, subcategory: string, activity: string) => {
    const newActivity = { system, category, subcategory, activity };
    
    setSelectedActivities(prev => {
      const exists = prev.some(a => 
        a.system === system &&
        a.category === category && 
        a.subcategory === subcategory && 
        a.activity === activity
      );
      
      if (exists) {
        return prev.filter(a => 
          !(a.system === system &&
            a.category === category && 
            a.subcategory === subcategory && 
            a.activity === activity)
        );
      }
      
      return [...prev, newActivity];
    });
  }, [setSelectedActivities]);

  const systemOptions: SystemType[] = ['LV', 'MV', 'HV', 'EHV'];

  return (
    <div className="space-y-6">
      {/* System Selection */}
      <div className="space-y-4">
        <FormLabel>Systems</FormLabel>
        <FormMessage>{form.formState.errors.systems?.message}</FormMessage>
        <div className="flex flex-wrap gap-4">
          {systemOptions.map((system) => (
            <div key={system} className="flex items-center space-x-2">
              <Checkbox
                id={`system-${system}`}
                checked={selectedSystems.includes(system)}
                onCheckedChange={() => handleSystemToggle(system)}
              />
              <label
                htmlFor={`system-${system}`}
                className="text-sm font-medium"
              >
                {system}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Activities Selection - shown only if systems are selected */}
      {selectedSystems.length > 0 && (
        <div className="space-y-4">
          <FormLabel>Activities</FormLabel>
          <FormMessage>{form.formState.errors.activities?.message}</FormMessage>
          
          <Tabs 
            value={activeSystemTab || undefined} 
            onValueChange={(value) => setActiveSystemTab(value as SystemType)}
            className="w-full"
          >
            <TabsList className="mb-4">
              {selectedSystems.map((system) => (
                <TabsTrigger key={system} value={system}>
                  {system} System
                </TabsTrigger>
              ))}
            </TabsList>
            
            {selectedSystems.map((system) => (
              <TabsContent key={system} value={system} className="mt-2">
                {/* Equipment Categories Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Select Equipment Types:</h3>
                  <div className="flex flex-wrap gap-3">
                    {sidebarData.map((category) => (
                      <div 
                        key={`${system}-category-${category.item}`} 
                        className={cn(
                          "flex items-center px-3 py-1.5 rounded-md space-x-2 cursor-pointer transition-colors",
                          selectedCategories[system]?.includes(category.item) 
                            ? "bg-primary/20 border border-primary/50" 
                            : "bg-muted/50 hover:bg-muted/80"
                        )}
                        onClick={() => handleCategoryToggle(system, category.item)}
                      >
                        <label className="text-sm font-medium cursor-pointer w-full">
                          {category.item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Only show categories that are selected */}
                <Accordion type="multiple" className="w-full">
                  {sidebarData
                    .filter(category => selectedCategories[system]?.includes(category.item))
                    .map((category) => (
                      <AccordionItem key={`${system}-${category.item}-accordion`} value={`${system}-${category.item}`}>
                        <AccordionTrigger className="font-semibold">
                          {category.item}
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Subcategory Selection */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-2">Select {category.item} Types:</h4>
                            <div className="flex flex-wrap gap-3">
                              {category.subitems.map((subcategory) => (
                                <div 
                                  key={`${system}-${category.item}-subcategory-${subcategory.name}`} 
                                  className={cn(
                                    "flex items-center px-3 py-1.5 rounded-md space-x-2 cursor-pointer transition-colors",
                                    selectedSubcategories[system]?.[category.item]?.includes(subcategory.name)
                                      ? "bg-primary/20 border border-primary/50" 
                                      : "bg-muted/50 hover:bg-muted/80"
                                  )}
                                  onClick={() => handleSubcategoryToggle(system, category.item, subcategory.name)}
                                >
                                  <label className="text-sm font-medium cursor-pointer w-full">
                                    {subcategory.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Show only selected subcategories */}
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            {category.subitems
                              .filter(subcategory => selectedSubcategories[system]?.[category.item]?.includes(subcategory.name))
                              .map((subcategory) => (
                                <div key={`${system}-${category.item}-${subcategory.name}`} className="space-y-2 border p-3 rounded-md">
                                  <h4 className="text-sm font-medium">{subcategory.name}</h4>
                                  <div className="space-y-1">
                                    {subcategory.activities.map((activity) => (
                                      <div key={`${system}-${category.item}-${subcategory.name}-${activity}`} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${system}-${category.item}-${subcategory.name}-${activity}`}
                                          checked={selectedActivities.some(
                                            a => a.system === system &&
                                                a.category === category.item && 
                                                a.subcategory === subcategory.name && 
                                                a.activity === activity
                                          )}
                                          onCheckedChange={() => 
                                            handleActivitySelect(system, category.item, subcategory.name, activity)
                                          }
                                        />
                                        <label
                                          htmlFor={`${system}-${category.item}-${subcategory.name}-${activity}`}
                                          className="text-sm"
                                        >
                                          {activity}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          {/* Show message if no subcategories selected */}
                          {(!selectedSubcategories[system]?.[category.item]?.length) && (
                            <div className="text-center py-6 text-muted-foreground">
                              Please select at least one {category.item.toLowerCase()} type to see available activities
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                
                {/* Show message if no categories selected */}
                {(selectedCategories[system]?.length || 0) === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    Please select at least one equipment type to see available activities
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
} 