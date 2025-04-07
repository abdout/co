'use client';

import { useState, useCallback } from 'react';

/**
 * A custom hook for handling server actions with state management.
 * This hook provides loading, error handling, and success callbacks
 * for server actions.
 * 
 * @param action The server action function to execute
 * @param options Configuration options including callbacks
 * @returns An object with execute method and state
 */
export function useActionState<T, A extends any[]>(
  action: (...args: A) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    onComplete?: () => void;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: A) => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Executing action: ${action.name || 'anonymous'}`);
        const result = await action(...args);
        console.log(`Action result:`, result);
        
        setData(result);
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        console.error(`Error in action ${action.name || 'anonymous'}:`, err);
        
        const errorMessage = err.message || 'Something went wrong';
        setError(errorMessage);
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        throw err;
      } finally {
        setIsLoading(false);
        
        if (options.onComplete) {
          options.onComplete();
        }
      }
    },
    [action, options]
  );

  return {
    execute,
    isLoading,
    error,
    data
  };
} 