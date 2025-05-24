import { useCallback } from "react";
import { SuccessToast, ErrorToast } from "@/components/atom/toast";
import { useRouter } from "next/navigation";
import { createActivities, ActionState } from "./action";
import { ActivitySchema } from "./validation";

interface UseFormSubmitProps {
  handleSubmit: (onValid: (data: ActivitySchema) => void) => (e: React.FormEvent<HTMLFormElement>) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export const useSubmit = ({ handleSubmit, setIsLoading }: UseFormSubmitProps) => {
  const router = useRouter();

  const onSubmit = useCallback(
    handleSubmit(async (data) => {
      if (setIsLoading) {
        setIsLoading(true);
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
          SuccessToast();
          
          // Navigate to the next step
          router.push("/onboarding/review");
        } else {
          ErrorToast(result.message || "فشل في حفظ البيانات");
        }
      } catch (error) {
        console.error("Eligibility submission error:", error);
        ErrorToast("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
      } finally {
        if (setIsLoading) {
          setIsLoading(false);
        }
      }
    }),
    [handleSubmit, router, setIsLoading]
  );

  return { onSubmit };
}; 