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
        <div className="flex flex-col gap-8 w-full px-4">
          {/* Eligibility Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            
            <div className="flex flex-wrap items-center justify-center w-[80%] gap-4">
              {eligibility.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={selectedEligibility.includes(item) ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    " transition-colors whitespace-normal",
                    selectedEligibility.includes(item) 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => toggleEligibility(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </form>
  );
} 