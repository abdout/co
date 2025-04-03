import { UseFormSetValue, FieldValues, Path, PathValue } from 'react-hook-form';
import { Option } from '@/components/atom/auto-complete';

interface SelectionHandlerProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  fieldMappings: Record<string, Path<T>>;
}

export function useSelect<T extends FieldValues>({
  setValue,
  fieldMappings
}: SelectionHandlerProps<T>) {
  const handleComplete = (selections: Record<string, Option>) => {
    // Set form values using setValue if selections are made
    Object.entries(selections).forEach(([selectionKey, selection]) => {
      const formField = fieldMappings[selectionKey];
      if (formField && selection) {
        setValue(formField, selection.value as PathValue<T, Path<T>>, { shouldValidate: true });
      }
    });
  };
  
  return { handleComplete };
} 