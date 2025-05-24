import { useEffect, useState } from 'react';
import { UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';
import { InformationSchema } from './validation';

interface UseFormInitProps {
  data?: InformationSchema;
  reset: UseFormReset<InformationSchema>;
  setEducationLevel: (level: string) => void;
  setCurrentFormId?: (id: string) => void;
  setValue: (name: keyof InformationSchema, value: InformationSchema[keyof InformationSchema]) => void;
}

export function useFormInit({
  data,
  reset,
  setEducationLevel,
  setCurrentFormId,
  setValue
}: UseFormInitProps) {
  // Add state for local storage data
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

  // Setup window form submission
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.submitInformationForm = () => {
        console.log('Global submit function called');
        const submitButton = document.querySelector('#submit-information') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
          return true;
        }
        return false;
      };
      
      return () => {
        delete window.submitInformationForm;
      };
    }
  }, []);

  // Set form ID
  useEffect(() => {
    try {
      setCurrentFormId?.('information');
    } catch {
      console.log('Unable to set current form ID');
    }
    
    // Set education level to student as default and update form value
    setValue('educationLevel', 'student');
  }, [setCurrentFormId, setValue]);

  // Load form values when data prop changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      console.log('Server data received:', data);
      
      // Reset form with server data, giving it priority over localStorage
      reset(data);
      
      // If education level is provided, update state
      if (data.educationLevel) {
        setEducationLevel(data.educationLevel);
      }
      
      // Also save to localStorage to ensure consistency
      try {
        localStorage.setItem('informationFormData', JSON.stringify(data));
        console.log('Saved server data to localStorage for later use');
      } catch (error) {
        console.error('Error saving server data to localStorage:', error);
      }
    } else if (!data && !localStorageLoaded) {
      // If no server data, try to load from localStorage
      try {
        const savedData = localStorage.getItem('informationFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('No server data, loading from localStorage:', parsedData);
          
          // Reset form with localStorage data
          reset(parsedData);
          
          // If education level is stored, update state
          if (parsedData.educationLevel) {
            setEducationLevel(parsedData.educationLevel);
          }
          
          toast.success("Loaded previously saved data");
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      
      setLocalStorageLoaded(true);
    }
  }, [data, reset, localStorageLoaded, setEducationLevel]);

  return {
    localStorageLoaded
  };
} 