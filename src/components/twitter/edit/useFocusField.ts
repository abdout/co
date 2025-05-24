import { useState } from 'react';

/**
 * A custom hook to manage focus state for a group of fields with width adjustment
 * @param config Configuration object for width percentages
 * @returns Object with focus state and helper functions
 */
export function useFocusField<T extends string>(
  config: {
    focusedWidth?: number;  // Width percentage for focused element (default: 50)
    defaultEqualWidth?: number;  // Width percentage when all equal (calculated by default)
  } = {}
) {
  // Set default config values
  const { 
    focusedWidth = 50,
    defaultEqualWidth,
  } = config;
  
  // Focus state
  const [focusedField, setFocusedField] = useState<T | null>(null);

  // Calculate the width for unfocused fields based on how many fields there might be
  const getUnfocusedWidth = (totalFields: number) => {
    return (100 - focusedWidth) / (totalFields - 1);
  };

  // Calculate default equal width (assuming all fields have the same width)
  const getEqualWidth = (totalFields: number) => {
    return defaultEqualWidth || Math.floor(100 / totalFields);
  };

  // Get the style for a field based on its focus state
  const getFieldStyle = (field: T, totalFields: number) => {
    // Common classes for all states
    const baseClasses = "w-full transition-all duration-300 relative overflow-hidden";
    
    if (focusedField === field) {
      // This field is focused - make it bigger
      return `${baseClasses} md:w-[${focusedWidth}%] z-10`;
    } else if (focusedField !== null) {
      // Another field is focused - make this one smaller
      const unfocusedWidth = getUnfocusedWidth(totalFields);
      return `${baseClasses} md:w-[${unfocusedWidth}%]`;
    } else {
      // No focus - all equal width
      // Use flex-1 for equal distribution when not focused
      const equalWidth = getEqualWidth(totalFields);
      return `${baseClasses} md:w-[${equalWidth}%] flex-1`;
    }
  };

  // Get container class for the parent flex container
  const getContainerClass = () => {
    if (focusedField === null) {
      // No focus - use flex with equal distribution
      return "w-full md:flex md:flex-row md:gap-3 items-stretch";
    } else {
      // Focused - use specific widths
      return "w-full md:flex md:flex-row md:gap-3 items-stretch";
    }
  };

  // Handler for focus event
  const handleFieldFocus = (field: T) => () => {
    setFocusedField(field);
  };

  // Handler for blur event
  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  return {
    focusedField,
    getFieldStyle,
    getContainerClass,
    handleFieldFocus,
    handleFieldBlur,
    setFocusedField,  // Direct setter in case you need more control
  };
} 
