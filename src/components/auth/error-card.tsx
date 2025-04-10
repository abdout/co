'use client';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  let errorMessage = "An unexpected error occurred";
  
  if (error === "OAuthAccountNotLinked") {
    errorMessage = "Email already in use with different provider!";
  } else if (error === "undefined" || !error) {
    errorMessage = "Authentication failed. Please try again.";
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied. You don't have permission to access this resource.";
  } else if (error === "Callback") {
    errorMessage = "Error in authentication callback. Please try again.";
  }

  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex flex-col items-center gap-4">
        <ExclamationTriangleIcon className="text-destructive h-10 w-10" />
        <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
      </div>
    </CardWrapper>
  );
};
