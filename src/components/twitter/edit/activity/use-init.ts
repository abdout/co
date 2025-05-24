import { useState, useEffect } from 'react';
import { UseFormWatch,
  //  UseFormSetValue 
  } from 'react-hook-form';
import { ActivitySchema } from './validation';
import { ActivityUser } from './type';

export function useInitActivities(
  user: ActivityUser,
  watch: UseFormWatch<ActivitySchema>,
  // setValue: UseFormSetValue<ActivitySchema>
) {  
  // Watched form value
  const watchedSelectedActivities = watch("selectedActivities");
  
  // State for selected activities 
  const [selectedActivities, setSelectedActivities] = useState<string[]>(watchedSelectedActivities || []);
  
  // Sync the watched value with our state
  useEffect(() => {
    setSelectedActivities(watchedSelectedActivities);
  }, [watchedSelectedActivities]);

  return {
    selectedActivities,
    setSelectedActivities
  };
} 