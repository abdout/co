import { useState, useEffect } from "react";

export const useStep = (voltages: any, currentStep: number, setCurrentStep: (value: number) => void) => {
  console.log("useStep: hook called with", { voltages, currentStep });
  const [step, setStep] = useState<string[]>([]);

  useEffect(() => {
    console.log("useStep: voltages changed", voltages);
    const newSteps = [];
    if (voltages.LV) newSteps.push("LV");
    if (voltages.MV) newSteps.push("MV");
    if (voltages.HV) newSteps.push("HV");
    if (voltages.EV) newSteps.push("EV");
    console.log("useStep: new steps calculated", newSteps);
    setStep(newSteps);
  }, [voltages]);

  useEffect(() => {
    console.log("useStep: step array updated", step);
  }, [step]);

  const nextStep = () => {
    const totalSteps = step.length + 2; // 2 initial steps + selected voltage steps
    console.log("useStep: nextStep called", { currentStep, totalSteps });
    if (currentStep < totalSteps) {
      console.log("useStep: moving to next step", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("useStep: already at last step, can't go next");
    }
  };

  const prevStep = () => {
    console.log("useStep: prevStep called", { currentStep });
    if (currentStep > 1) {
      console.log("useStep: moving to previous step", currentStep - 1);
      setCurrentStep(currentStep - 1);
    } else {
      console.log("useStep: already at first step, can't go back");
    }
  };

  return { step, nextStep, prevStep };
};