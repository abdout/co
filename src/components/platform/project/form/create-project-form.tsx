'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { projectFormSchema, type ProjectFormValues } from '@/schemas/project';
import { sidebarData } from '@/components/template/sidebar/constant';
import { createProject } from '@/actions/projects';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

type SystemType = 'MV SWGR' | 'HV SWGR' | 'LV SWGR' | 'POWER TRAFO' | 'DIST. TRAFO' | 'CABLE' | 'COMPONENT' | 'AUX. SUPPLY' | 'RELAY' | 'RMU';
type ActivityWithSystem = {
  system: SystemType;
  category: string;
  subcategory: string;
  activity: string;
};

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

// Mock data - These would be fetched from your APIs in production
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' },
  { id: '4', name: 'Sarah Williams' },
  { id: '5', name: 'Mike Brown' },
];

const TEAM_LEADS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Sarah Williams' },
];

const KITS = [
  { id: '1', name: 'Testing Kit A' },
  { id: '2', name: 'Measurement Kit B' },
  { id: '3', name: 'Relay Test Kit' },
  { id: '4', name: 'Protection Kit C' },
  { id: '5', name: 'Circuit Breaker Kit' },
];

const CARS = [
  { id: '1', name: 'Toyota SUV' },
  { id: '2', name: 'Ford Pickup' },
  { id: '3', name: 'Chevrolet Van' },
  { id: '4', name: 'Nissan Truck' },
  { id: '5', name: 'Jeep 4x4' },
];

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState<SystemType[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<ActivityWithSystem[]>([]);
  const [activeSystemTab, setActiveSystemTab] = useState<SystemType | null>(null);
  
  // Track selected categories per system
  const [selectedCategories, setSelectedCategories] = useState<Record<SystemType, string[]>>({
    'MV SWGR': [],
    'HV SWGR': [],
    'LV SWGR': [],
    'POWER TRAFO': [],
    'DIST. TRAFO': [],
    'CABLE': [],
    'COMPONENT': [],
    'AUX. SUPPLY': [],
    'RELAY': [],
    'RMU': []
  });
  
  // Track selected subcategories per system and category
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<SystemType, Record<string, string[]>>>({
    'MV SWGR': {},
    'HV SWGR': {},
    'LV SWGR': {},
    'POWER TRAFO': {},
    'DIST. TRAFO': {},
    'CABLE': {},
    'COMPONENT': {},
    'AUX. SUPPLY': {},
    'RELAY': {},
    'RMU': {}
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: '',
      location: '',
      client: '',
      consultant: '',
      status: 'Draft',
      team: [],
      teamLead: '',
      systems: [],
      activities: [],
      mobilization: '',
      accommodation: '',
      kits: [],
      cars: [],
      description: '',
    },
  });

  useEffect(() => {
    // When selected systems change, update the form value
    form.setValue('systems', selectedSystems);
    
    // If we have systems but no active tab, set the first system as active
    if (selectedSystems.length > 0 && !activeSystemTab) {
      setActiveSystemTab(selectedSystems[0]);
    } else if (selectedSystems.length === 0) {
      // If no systems are selected, clear the active tab
      setActiveSystemTab(null);
    } else if (!selectedSystems.includes(activeSystemTab as SystemType)) {
      // If the active tab is not in selected systems anymore, update active tab
      setActiveSystemTab(selectedSystems[0]);
    }
  }, [selectedSystems, activeSystemTab, form]);

  useEffect(() => {
    // When selected activities change, update the form value
    form.setValue('activities', selectedActivities);
  }, [selectedActivities, form]);

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

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createProject({
        ...data,
        title: data.projectName,
        description: data.description || `Project for ${data.projectName}`,
      });

      if (result.success) {
        toast.success('Project created successfully!');
        form.reset();
        setSelectedSystems([]);
        setSelectedActivities([]);
        setSelectedCategories({
          'MV SWGR': [],
          'HV SWGR': [],
          'LV SWGR': [],
          'POWER TRAFO': [],
          'DIST. TRAFO': [],
          'CABLE': [],
          'COMPONENT': [],
          'AUX. SUPPLY': [],
          'RELAY': [],
          'RMU': []
        });
        setSelectedSubcategories({
          'MV SWGR': {},
          'HV SWGR': {},
          'LV SWGR': {},
          'POWER TRAFO': {},
          'DIST. TRAFO': {},
          'CABLE': {},
          'COMPONENT': {},
          'AUX. SUPPLY': {},
          'RELAY': {},
          'RMU': {}
        });
        setActiveSystemTab(null);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message || 'Failed to create project');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const systemOptions: SystemType[] = ['MV SWGR', 'HV SWGR', 'LV SWGR', 'POWER TRAFO', 'DIST. TRAFO', 'CABLE', 'COMPONENT', 'AUX. SUPPLY', 'RELAY', 'RMU'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-10">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consultant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultant</FormLabel>
                <FormControl>
                  <Input placeholder="Enter consultant name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Team Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="teamLead"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Team Lead</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button 
                        variant="outline" 
                        role="combobox" 
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? TEAM_LEADS.find(lead => lead.id === field.value)?.name
                          : "Select team lead"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search team leads..." />
                      <CommandEmpty>No team lead found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {TEAM_LEADS.map((lead) => (
                            <CommandItem
                              key={lead.id}
                              value={lead.name}
                              onSelect={() => {
                                form.setValue("teamLead", lead.id);
                              }}
                            >
                              {lead.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Members</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((memberId) => {
                        const member = TEAM_MEMBERS.find(m => m.id === memberId);
                        return (
                          <Badge key={memberId} variant="secondary">
                            {member?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== memberId) || [];
                                form.setValue('team', newValue);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button 
                          variant="outline" 
                          type="button"
                          className="w-full justify-between"
                        >
                          <span>Select team members</span>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search team members..." />
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {TEAM_MEMBERS
                              .filter(member => !field.value?.includes(member.id))
                              .map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={member.name}
                                  onSelect={() => {
                                    const newValue = [...(field.value || []), member.id];
                                    form.setValue('team', newValue);
                                  }}
                                >
                                  {member.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobilization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobilization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobilization details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="accommodation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accommodation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter accommodation details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kits</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((kitId) => {
                        const kit = KITS.find(k => k.id === kitId);
                        return (
                          <Badge key={kitId} variant="secondary">
                            {kit?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== kitId) || [];
                                form.setValue('kits', newValue);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button 
                          variant="outline" 
                          type="button"
                          className="w-full justify-between"
                        >
                          <span>Select kits</span>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search kits..." />
                        <CommandEmpty>No kit found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {KITS
                              .filter(kit => !field.value?.includes(kit.id))
                              .map((kit) => (
                                <CommandItem
                                  key={kit.id}
                                  value={kit.name}
                                  onSelect={() => {
                                    const newValue = [...(field.value || []), kit.id];
                                    form.setValue('kits', newValue);
                                  }}
                                >
                                  {kit.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cars</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((carId) => {
                        const car = CARS.find(c => c.id === carId);
                        return (
                          <Badge key={carId} variant="secondary">
                            {car?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== carId) || [];
                                form.setValue('cars', newValue);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button 
                          variant="outline" 
                          type="button"
                          className="w-full justify-between"
                        >
                          <span>Select cars</span>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search cars..." />
                        <CommandEmpty>No car found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {CARS
                              .filter(car => !field.value?.includes(car.id))
                              .map((car) => (
                                <CommandItem
                                  key={car.id}
                                  value={car.name}
                                  onSelect={() => {
                                    const newValue = [...(field.value || []), car.id];
                                    form.setValue('cars', newValue);
                                  }}
                                >
                                  {car.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* System Selection */}
        <div className="space-y-3">
          <FormLabel>Systems</FormLabel>
          <FormMessage>{form.formState.errors.systems?.message}</FormMessage>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {systemOptions.map((system) => (
              <div key={system} className="flex items-center space-x-1.5">
                <Checkbox
                  id={`system-${system}`}
                  checked={selectedSystems.includes(system)}
                  onCheckedChange={() => handleSystemToggle(system)}
                  className="h-3.5 w-3.5"
                />
                <label
                  htmlFor={`system-${system}`}
                  className="text-xs font-medium"
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setSelectedSystems([]);
              setSelectedActivities([]);
              setSelectedCategories({
                'MV SWGR': [],
                'HV SWGR': [],
                'LV SWGR': [],
                'POWER TRAFO': [],
                'DIST. TRAFO': [],
                'CABLE': [],
                'COMPONENT': [],
                'AUX. SUPPLY': [],
                'RELAY': [],
                'RMU': []
              });
              setSelectedSubcategories({
                'MV SWGR': {},
                'HV SWGR': {},
                'LV SWGR': {},
                'POWER TRAFO': {},
                'DIST. TRAFO': {},
                'CABLE': {},
                'COMPONENT': {},
                'AUX. SUPPLY': {},
                'RELAY': {},
                'RMU': {}
              });
              setActiveSystemTab(null);
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              form.setValue('status', 'Draft');
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 