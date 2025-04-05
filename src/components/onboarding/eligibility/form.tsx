'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormContext } from '@/components/onboarding/form-context';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityUser } from './type';
import { activitySchema, ActivitySchema } from './validation';
import { useSubmit } from './use-submit';
import { Button } from "@/components/ui/button";
import { eligibility, Eligibility } from './constant';
import { cn } from "@/lib/utils";
import PageHeading from "../page-heading";

interface ActivityFormProps {
  user: ActivityUser;
}

export default function ActivityForm({ user }: ActivityFormProps) {
  const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();
  
  // Initialize form with useForm
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      eligibility: user.eligibility || [],
    }
  });

  const { onSubmit } = useSubmit({ handleSubmit, setIsSubmitting });

  const selectedEligibility = watch("eligibility") || [];

  const toggleEligibility = (item: Eligibility) => {
    const current = selectedEligibility;
    if (current.includes(item)) {
      setValue("eligibility", current.filter((i) => i !== item));
    } else {
      setValue("eligibility", [...current, item]);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full h-full flex flex-col space-y-8"
      noValidate
    >
      <PageHeading title="Eligibility"/>
      <ScrollArea className="w-full flex-1 pr-4">
        <div className="flex flex-col gap-4 w-full px-4">
          {/* Eligibility Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            
            <div className="flex flex-wrap items-center justify-center w-[75%] gap-2 py-8">
              {eligibility.map((item, index) => {
                // Create varying sizes based on item length or random
                const sizeClass = [
                  "text-xs", 
                  "text-sm", 
                  "text-base", 
                  "text-lg", 
                  "text-xl", 
                  
                ][Math.floor(index % 6)];

                // Create varying blue shades
                const colorClass = selectedEligibility.includes(item)
                  ? "text-foreground"
                  : [
                      "text-muted-foreground", 
                      "text-muted-foreground/80", 
                      "text-muted-foreground/90", 
                      "text-muted-foreground", 
                      "text-muted-foreground/70", 
                      "text-muted-foreground/80"
                    ][Math.floor(index % 6)];
                
                // Font weight variation
                const weightClass = selectedEligibility.includes(item)
                  ? "font-bold"
                  : "font-normal";

                return (
                  <Button
                    key={item}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "rounded-full transition-colors border-0 px-1 py-0 hover:bg-transparent",
                      sizeClass,
                      weightClass,
                      selectedEligibility.includes(item) 
                        ? "bg-transparent text-foreground font-medium" 
                        : `${colorClass} hover:text-foreground`
                    )}
                    onClick={() => toggleEligibility(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </form>
  );
} 