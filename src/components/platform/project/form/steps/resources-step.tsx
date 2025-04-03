'use client';

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ProjectFormValues } from '@/schemas/project';

interface ResourcesStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export default function ResourcesStep({ form }: ResourcesStepProps) {
  return (
    <div className="space-y-6">
      {/* Team Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Team</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="teamLead"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Lead</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team lead name" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input 
                    placeholder="Enter team members (comma-separated)" 
                    onChange={(e) => field.onChange(e.target.value.split(',').map(m => m.trim()))}
                    defaultValue={field.value?.join(', ')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Physical Resources */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Travel & Equipment</h3>
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kits</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter kits (comma-separated)" 
                    onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()))}
                    defaultValue={field.value?.join(', ')}
                  />
                </FormControl>
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
                <FormControl>
                  <Input 
                    placeholder="Enter cars (comma-separated)" 
                    onChange={(e) => field.onChange(e.target.value.split(',').map(c => c.trim()))}
                    defaultValue={field.value?.join(', ')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
} 