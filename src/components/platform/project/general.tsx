import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Control } from "react-hook-form";
import { type ProjectFormValues } from "./validation";

interface GeneralTabProps {
  control: Control<ProjectFormValues>;
}

export function GeneralTab({ control }: GeneralTabProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b">General Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          control={control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Customer</FormLabel>
              <FormControl>
                <Input placeholder="Customer" {...field} className="bg-muted/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Client</FormLabel>
              <FormControl>
                <Input placeholder="Client" {...field} className="bg-muted/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="consultant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Consultant</FormLabel>
              <FormControl>
                <Input placeholder="Consultant" {...field} className="bg-muted/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} className="bg-muted/30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
} 