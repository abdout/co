import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, X } from "lucide-react";
import { type Control } from "react-hook-form";
import { type ProjectFormValues } from "./validation";
import { TEAM_MEMBERS, TEAM_LEADS, KITS, CARS } from "./constant";
import { cn } from "@/lib/utils";

interface ResourcesTabProps {
  control: Control<ProjectFormValues>;
}

export function ResourcesTab({ control }: ResourcesTabProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Resources</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="teamLead"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-medium">Team Lead</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button 
                        variant="outline" 
                        role="combobox" 
                        className={cn(
                          "w-full justify-between bg-muted/30",
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
                                field.onChange(lead.id);
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
            control={control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Team Members</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((memberId) => {
                        const member = TEAM_MEMBERS.find(m => m.id === memberId);
                        return (
                          <Badge key={memberId} variant="secondary" className="px-3 py-1">
                            {member?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== memberId) || [];
                                field.onChange(newValue);
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
                          className="w-full justify-between bg-muted/30"
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
                                    field.onChange(newValue);
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
            control={control}
            name="mobilization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Mobilization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobilization details" {...field} className="bg-muted/30" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="accommodation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Accommodation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter accommodation details" {...field} className="bg-muted/30" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="kits"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Kits</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((kitId) => {
                        const kit = KITS.find(k => k.id === kitId);
                        return (
                          <Badge key={kitId} variant="secondary" className="px-3 py-1">
                            {kit?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== kitId) || [];
                                field.onChange(newValue);
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
                          className="w-full justify-between bg-muted/30"
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
                                    field.onChange(newValue);
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
            control={control}
            name="cars"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Cars</FormLabel>
                <div className="space-y-3">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((carId) => {
                        const car = CARS.find(c => c.id === carId);
                        return (
                          <Badge key={carId} variant="secondary" className="px-3 py-1">
                            {car?.name}
                            <button
                              type="button"
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const newValue = field.value?.filter(id => id !== carId) || [];
                                field.onChange(newValue);
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
                          className="w-full justify-between bg-muted/30"
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
                                    field.onChange(newValue);
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
      </div>
    </section>
  );
} 