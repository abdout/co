import React from 'react';
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface PrevNextButtonsProps {
  currentStep: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
}

const PrevNextButtons: React.FC<PrevNextButtonsProps> = ({ currentStep, totalSteps, prevStep, nextStep }) => {
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    prevStep();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrev}
        disabled={currentStep === 1}
        className="h-10 px-4 rounded-md flex items-center gap-1"
      >
        <Icon icon="ooui:next-rtl" width="1.2em" height="1.2em" />
        <span>Previous</span>
      </Button>

      <div className="text-sm font-medium">
        {currentStep} / {totalSteps}
      </div>

      <Button
        type="button"
        variant="default"
        onClick={handleNext}
        disabled={currentStep === totalSteps}
        className="h-10 px-4 rounded-md flex items-center gap-1"
      >
        <span>Next</span>
        <Icon icon="ooui:next-ltr" width="1.2em" height="1.2em" />
      </Button>
    </div>
  );
};

export default PrevNextButtons;