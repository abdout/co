'use client';
import React, { createContext, useContext, useRef, useState } from 'react';

interface FormContextType {
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  currentFormId: string;
  setCurrentFormId: (value: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormId, setCurrentFormId] = useState('');

  return (
    <FormContext.Provider value={{ 
      formRef, 
      isSubmitting, 
      setIsSubmitting,
      currentFormId,
      setCurrentFormId
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 