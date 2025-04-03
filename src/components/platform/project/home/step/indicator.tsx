import React from 'react';

interface IndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const Indicator: React.FC<IndicatorProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;
        
        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`
                flex items-center justify-center h-8 w-8 rounded-full 
                text-xs font-medium transition-all duration-200
                ${isActive 
                  ? "bg-black text-white ring-2 ring-offset-2 ring-black" 
                  : isPast 
                    ? "bg-gray-600 text-white" 
                    : "bg-gray-200 text-gray-700"}
              `}
            >
              {stepNumber}
            </div>
            {index < totalSteps - 1 && (
              <div 
                className={`
                  h-[2px] w-8 mt-4 
                  ${currentStep > stepNumber ? "bg-black" : "bg-gray-200"}
                `} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Indicator;