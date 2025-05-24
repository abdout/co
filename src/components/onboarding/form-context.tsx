'use client';
import React, { createContext, useContext, useRef, useState } from 'react';
import Loading from '@/components/atom/loading';

interface FormContextType {
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  currentFormId: string;
  setCurrentFormId: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormId, setCurrentFormId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FormContext.Provider value={{ 
      formRef, 
      isSubmitting, 
      setIsSubmitting,
      currentFormId,
      setCurrentFormId,
      isLoading,
      setIsLoading
    }}>
      {isLoading && <Loading />}
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