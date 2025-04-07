'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, type ProjectFormValues } from './validation';
import { createProject, updateProject } from './actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Systems, type ActivityWithSystem, type ProjectCreateFormProps } from './types';
import { GeneralTab } from './general';
import { ActivitiesTab } from './activities';
import { ResourcesTab } from './resources';
import { DescriptionTab } from './description';

export default function ProjectCreateForm({ projectToEdit, onSuccess, onClose }: ProjectCreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState<Systems[]>([]);
  const [activeSystemTab, setActiveSystemTab] = useState<Systems | null>(null);
  
  // Replace useActionState with regular state
  const [selectedActivities, setSelectedActivities] = useState<ActivityWithSystem[]>(
    (projectToEdit?.activities as unknown as ActivityWithSystem[]) || []
  );
  
  // Track selected categories per system
  const [selectedCategories, setSelectedCategories] = useState<Record<Systems, string[]>>({
    'MV SWGR': [],
    'HV SWGR': [],
    'LV SWGR': [],
    'POWER TRAFO': [],
    'DIST. TRAFO': [],
    'COMPONENT': [],
    'RELAY': [],
    'RMU': [],
    'LOW CURRENT': []
  });
  
  // Track selected subcategories per system and category
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<Systems, Record<string, string[]>>>({
    'MV SWGR': {},
    'HV SWGR': {},
    'LV SWGR': {},
    'POWER TRAFO': {},
    'DIST. TRAFO': {},
    'COMPONENT': {},
    'RELAY': {},
    'RMU': {},
    'LOW CURRENT': {}
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      customer: projectToEdit?.customer || '',
      description: projectToEdit?.description || '',
      location: projectToEdit?.location || '',
      client: projectToEdit?.client || '',
      consultant: projectToEdit?.consultant || '',
      status: projectToEdit?.status || 'pending',
      priority: projectToEdit?.priority || 'pending',
      phase: projectToEdit?.phase || 'approved',
      team: projectToEdit?.team || [],
      teamLead: projectToEdit?.teamLead || '',
      systems: projectToEdit?.systems || [],
      activities: projectToEdit?.activities || [],
      mobilization: projectToEdit?.mobilization || '',
      accommodation: projectToEdit?.accommodation || '',
      kits: projectToEdit?.kits || [],
      cars: projectToEdit?.cars || [],
      startDate: projectToEdit?.startDate || undefined,
      endDate: projectToEdit?.endDate || undefined,
    },
  });

  // Initialize selectedSystems from projectToEdit if available
  useEffect(() => {
    if (projectToEdit && projectToEdit.systems && projectToEdit.systems.length > 0) {
      const systemTypes = projectToEdit.systems.filter((sys): sys is Systems => 
        ['MV SWGR', 'HV SWGR', 'LV SWGR', 'POWER TRAFO', 'DIST. TRAFO', 'COMPONENT', 'RELAY', 'RMU', 'LOW CURRENT'].includes(sys)
      );
      setSelectedSystems(systemTypes);
      
      if (systemTypes.length > 0) {
        setActiveSystemTab(systemTypes[0]);
      }
    }
    
    // Initialize categories and subcategories from project activities
    if (projectToEdit?.activities && projectToEdit.activities.length > 0) {
      const categoriesMap: Record<Systems, string[]> = {
        'MV SWGR': [],
        'HV SWGR': [],
        'LV SWGR': [],
        'POWER TRAFO': [],
        'DIST. TRAFO': [],
        'COMPONENT': [],
        'RELAY': [],
        'RMU': [],
        'LOW CURRENT': []
      };
      
      const subcategoriesMap: Record<Systems, Record<string, string[]>> = {
        'MV SWGR': {},
        'HV SWGR': {},
        'LV SWGR': {},
        'POWER TRAFO': {},
        'DIST. TRAFO': {},
        'COMPONENT': {},
        'RELAY': {},
        'RMU': {},
        'LOW CURRENT': {}
      };
      
      projectToEdit.activities.forEach(activity => {
        const system = activity.system as Systems;
        if (!system) return;
        
        // Add category if not already added
        if (!categoriesMap[system].includes(activity.category)) {
          categoriesMap[system].push(activity.category);
        }
        
        // Initialize subcategory array if needed
        if (!subcategoriesMap[system][activity.category]) {
          subcategoriesMap[system][activity.category] = [];
        }
        
        // Add subcategory if not already added
        if (!subcategoriesMap[system][activity.category].includes(activity.subcategory)) {
          subcategoriesMap[system][activity.category].push(activity.subcategory);
        }
      });
      
      setSelectedCategories(categoriesMap);
      setSelectedSubcategories(subcategoriesMap);
    }
  }, [projectToEdit]);

  useEffect(() => {
    // When selected systems change, update the form value
    if (selectedSystems.length > 0) {
      form.setValue('systems', selectedSystems, { shouldValidate: false });
    }
    
    // If we have systems but no active tab, set the first system as active
    if (selectedSystems.length > 0 && !activeSystemTab) {
      setActiveSystemTab(selectedSystems[0]);
    } else if (selectedSystems.length === 0) {
      // If no systems are selected, clear the active tab
      setActiveSystemTab(null);
    } else if (!selectedSystems.includes(activeSystemTab as Systems)) {
      // If the active tab is not in selected systems anymore, update active tab
      setActiveSystemTab(selectedSystems[0]);
    }
  }, [selectedSystems, activeSystemTab]);

  // Separate effect for form value updates
  useEffect(() => {
    if (selectedSystems.length > 0) {
      form.setValue('systems', selectedSystems, { shouldValidate: false });
    }
  }, [selectedSystems, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields have default values
      const projectData = {
        customer: data.customer || '',
        description: data.description || '',
        location: data.location || '',
        client: data.client || '',
        consultant: data.consultant || '',
        status: data.status || 'pending',
        priority: data.priority || 'pending',
        phase: data.phase || 'approved',
        team: data.team || [],
        teamLead: data.teamLead || '',
        systems: selectedSystems || [],
        activities: selectedActivities || [],
        mobilization: data.mobilization || '',
        accommodation: data.accommodation || '',
        kits: data.kits || [],
        cars: data.cars || [],
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      };
      
      let result;
      
      if (projectToEdit && projectToEdit.id) {
        // Update existing project
        result = await updateProject(projectToEdit.id, projectData);
        if (result.success) {
          toast.success('Project updated successfully!');
        }
      } else {
        // Create new project
        result = await createProject(projectData);
        if (result.success) {
          toast.success('Project created successfully!');
        }
      }

      if (result.success) {
        // Reset form state
        form.reset();
        setSelectedSystems([]);
        setSelectedCategories({
          'MV SWGR': [],
          'HV SWGR': [],
          'LV SWGR': [],
          'POWER TRAFO': [],
          'DIST. TRAFO': [],
          'COMPONENT': [],
          'RELAY': [],
          'RMU': [],
          'LOW CURRENT': []
        });
        setSelectedSubcategories({
          'MV SWGR': {},
          'HV SWGR': {},
          'LV SWGR': {},
          'POWER TRAFO': {},
          'DIST. TRAFO': {},
          'COMPONENT': {},
          'RELAY': {},
          'RMU': {},
          'LOW CURRENT': {}
        });
        setSelectedActivities([]);
        
        if (onSuccess) {
          await onSuccess();
        }
        if (onClose) {
          onClose();
        }
      } else {
        toast.error(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle system toggle
  const handleSystemToggle = useCallback((system: Systems) => {
    setSelectedSystems(prev => {
      if (prev.includes(system)) {
        // If system is already selected, remove it and all its activities
        handleUnselectAllActivities(system, '*', null);
        // Clear selected categories for this system
        setSelectedCategories(prev => ({
          ...prev,
          [system]: []
        }));
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
  }, []);

  // Handle activity change
  const handleActivityChange = useCallback((system: Systems, category: string, subcategory: string, activity: string, checked: boolean) => {
    setSelectedActivities(prev => {
      if (checked) {
        // Add the activity
        return [...prev, { system, category, subcategory, activity }];
      } else {
        // Remove the activity
        return prev.filter(a => 
          !(a.system === system &&
            a.category === category && 
            a.subcategory === subcategory && 
            a.activity === activity)
        );
      }
    });
  }, []);

  const handleSelectAllActivities = useCallback((system: Systems, category: string, subcategory: string | null, activities: ActivityWithSystem[]) => {
    setSelectedActivities(prev => {
      // Remove existing activities for this category/subcategory
      const filteredPrev = prev.filter(a => 
        !(a.system === system && 
          a.category === category && 
          (!subcategory || a.subcategory === subcategory))
      );
      
      // Add new activities
      return [...filteredPrev, ...activities];
    });
  }, []);

  const handleUnselectAllActivities = useCallback((system: Systems, category: string, subcategory: string | null) => {
    setSelectedActivities(prev => {
      if (subcategory) {
        // Remove activities for specific subcategory
        return prev.filter(a => 
          !(a.system === system && 
            a.category === category && 
            a.subcategory === subcategory)
        );
      } else {
        // Remove all activities for the category
        return prev.filter(a => 
          !(a.system === system && a.category === category)
        );
      }
    });
  }, []);

  // Handle category toggle
  const handleCategoryToggle = useCallback((system: Systems, category: string) => {
    const systemCategories = selectedCategories[system] || [];
    const isSelected = systemCategories.includes(category);

    // Update categories first
    setSelectedCategories(prev => ({
      ...prev,
      [system]: isSelected 
        ? systemCategories.filter(c => c !== category)
        : [...systemCategories, category]
    }));

    // Update subcategories
    setSelectedSubcategories(prev => ({
      ...prev,
      [system]: {
        ...prev[system],
        [category]: isSelected ? [] : []
      }
    }));

    // Handle activities
    if (isSelected) {
      handleUnselectAllActivities(system, category, null);
    }
  }, [selectedCategories, handleUnselectAllActivities]);

  // Handle subcategory toggle
  const handleSubcategoryToggle = useCallback((system: Systems, category: string, subcategory: string) => {
    setSelectedSubcategories(prev => {
      const categorySubcategories = prev[system]?.[category] || [];
      const isSelected = categorySubcategories.includes(subcategory);

      if (isSelected) {
        // Remove subcategory and filter out related activities
        handleUnselectAllActivities(system, category, subcategory);
      }

      return {
        ...prev,
        [system]: {
          ...prev[system],
          [category]: isSelected 
            ? categorySubcategories.filter(s => s !== subcategory)
            : [...categorySubcategories, subcategory]
        }
      };
    });
  }, [handleUnselectAllActivities]);

  return (
    <ScrollArea className="h-full max-h-screen pr-4">
      <div className="container mx-auto py-8 px-10 max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-16">
                <GeneralTab control={form.control} />
              </TabsContent>

              <TabsContent value="activities" className="space-y-16">
                <ActivitiesTab 
                  control={form.control}
                  selectedSystems={selectedSystems}
                  selectedActivities={selectedActivities}
                  selectedCategories={selectedCategories}
                  selectedSubcategories={selectedSubcategories}
                  activeSystemTab={activeSystemTab}
                  onSystemToggle={handleSystemToggle}
                  onActivityChange={handleActivityChange}
                  onSelectAllActivities={handleSelectAllActivities}
                  onUnselectAllActivities={handleUnselectAllActivities}
                  onCategoryToggle={handleCategoryToggle}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  setActiveSystemTab={setActiveSystemTab}
                />
              </TabsContent>

              <TabsContent value="resources" className="space-y-16">
                <ResourcesTab control={form.control} />
              </TabsContent>

              <TabsContent value="description" className="space-y-16">
                <DescriptionTab control={form.control} />
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="w-full sm:w-auto px-8 py-6 rounded-md"
                disabled={isSubmitting}
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting 
                  ? (projectToEdit ? "Updating Project..." : "Creating Project...") 
                  : (projectToEdit ? "Update Project" : "Create Project")
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
} 