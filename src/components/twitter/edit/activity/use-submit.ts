import { useEffect, useTransition } from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { useActionState } from "react";
import { submitActivityForm } from "./action";
import { ActivitySchema } from "./validation";
import { getNextRoute } from "../utils";
import { SuccessToast, ErrorToast } from "@/components/atom/toast";

interface UseFormSubmitProps {
  handleSubmit: UseFormHandleSubmit<ActivitySchema>;
  setIsSubmitting: (value: boolean) => void;
}

export function useSubmit({ handleSubmit, setIsSubmitting }: UseFormSubmitProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Set up useActionState like other working forms
  const [state, formAction] = useActionState(
    submitActivityForm,
    {
      success: false,
      error: false
    }
  );

  // Handle form submission following the pattern from other forms
  const onSubmit = handleSubmit((data) => {
    console.log("Form submission started with valid data:", JSON.stringify(data, null, 2));
    setIsSubmitting(true);
    
    // Ensure the data is properly formatted
    const formattedData = {
      ...data,
      skills: Array.isArray(data.skills) ? data.skills : [],
      interests: Array.isArray(data.interests) ? data.interests : [],
      // Only use boolean for fields that exist in schema
      partyMember: data.partyMember === true,
      unionMember: data.unionMember === true,
      ngoMember: data.ngoMember === true,
      clubMember: data.clubMember === true,
      // voluntaryMember is handled specially in the server action since it's not in the schema
    };
    
    // Save to localStorage for step navigation tracking
    localStorage.setItem('activityFormData', JSON.stringify(formattedData));
    
    // Use startTransition to call the server action
    startTransition(() => {
      formAction(formattedData);
    });
  });

  // Handle form state changes
  useEffect(() => {
    console.log("Action state changed:", state);
    
    if (state.success) {
      console.log("Form submission successful");
      SuccessToast(); // Use centralized success toast
      router.push(getNextRoute(pathname));
    } else if (state.error) {
      console.error("Form submission failed with error state", state.message || "Unknown error");
      ErrorToast(state.message ? `${state.message}` : "حدث خطأ أثناء حفظ المعلومات");
      setIsSubmitting(false);
    }
  }, [state, router, pathname, setIsSubmitting]);

  return {
    onSubmit,
    isPending,
    state
  };
} 