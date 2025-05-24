import React, { ReactNode } from 'react';

interface FormWrapperProps {
  children: ReactNode;
  isPending?: boolean;
  className?: string;
}

export const FormWrapper = ({
  children,
  isPending = false,
  className = "",
}: FormWrapperProps) => {
  return (
    <div className={`bg-white p-6 rounded-md shadow-sm ${className}`}>
      <div className={`${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        {children}
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-md">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default FormWrapper; 