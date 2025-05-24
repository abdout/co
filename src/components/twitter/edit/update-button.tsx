import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { editRoutes } from "@/components/twitter/edit/type";

const steps = [
  
  editRoutes.ATTACHMENT,
  editRoutes.CONTACT,
  editRoutes.INFORMATION,
  editRoutes.ACTIVITY,
  
];

const UpdateButton = ({ pending }: { pending: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((route) => route === pathname);
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNextStep = () => {
    if (!isLastStep) {
      router.push(steps[currentStepIndex + 1]);
    }
  };

  return (
    <Button
      onClick={handleNextStep}
      disabled={pending}
      variant="outline"
      size={isLastStep ? "default" : "icon"}
      className={`mt-2 ${isLastStep ? "px-4 py-2" : "p-0"} rounded-full text-gray-600 w-10 h-10`}
    >
      {pending ? (
        "Updating..."
      ) : isLastStep ? (
        "طلب العضوية"
      ) : (
        <FaChevronLeft size={14} />
      )}
    </Button>
  );
};

export default UpdateButton;
