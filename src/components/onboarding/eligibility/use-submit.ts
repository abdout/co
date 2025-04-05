import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createActivities, ActionState } from "./action";
import { ActivitySchema } from "./validation";

interface UseFormSubmitProps {
  handleSubmit: (onValid: (data: ActivitySchema) => void) => (e: React.FormEvent<HTMLFormElement>) => void;
  setIsSubmitting?: (isSubmitting: boolean) => void;
}

export const useSubmit = ({ handleSubmit, setIsSubmitting }: UseFormSubmitProps) => {
  const router = useRouter();

  const onSubmit = useCallback(
    handleSubmit(async (data) => {
      if (setIsSubmitting) {
        setIsSubmitting(true);
      }

      try {
        // Initialize the state
        const initialState: ActionState = {
          success: false,
          error: false,
        };

        // Submit the form
        const result = await createActivities(initialState, data);

        if (result.success) {
          toast.success("Eligibility save success!");
          
          // Navigate to the next step
          router.push("/onboarding/review");
        } else {
          toast.error(result.message || "Eligibility save faild!");
        }
      } catch (error) {
        console.error("Eligibility submission error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        if (setIsSubmitting) {
          setIsSubmitting(false);
        }
      }
    }),
    [handleSubmit, router, setIsSubmitting]
  );

  return { onSubmit };
}; 