'use client';

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ProjectFormValues } from '@/schemas/project';

interface GeneralInfoStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

export default function GeneralInfoStep({ form }: GeneralInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">General</h2>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Project Name" {...field} />
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
              <FormControl>
                <Input placeholder="Location" {...field} />
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
              <FormControl>
                <Input placeholder="Client" {...field} />
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
              <FormControl>
                <Input placeholder="Consultant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
} 