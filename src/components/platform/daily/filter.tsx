import { useDaily } from './context';
import { useEffect, useState } from 'react';
import { daily } from './type';

interface FilterOption {
    label: string;
    value: string;
}

const getUniqueValues = (dailyReports: daily[] | unknown, property: keyof daily): FilterOption[] => {
    // Check if dailyReports is an array and not empty
    if (!Array.isArray(dailyReports) || dailyReports.length === 0) {
      return [];
    }
    
    if (property === 'description' || property === 'blockers' || property === 'plannedTomorrow') {
      return [];
    }
  
    const values = dailyReports.map(report => report[property]);
    return Array.from(new Set(values))
      .filter(value => value !== undefined && value !== null)
      .map(value => ({ label: value as string, value: value as string }));
};

// Default values for status and priority when no daily reports are available
const getDefaultOptions = (property: keyof daily): FilterOption[] => {
  if (property === 'status') {
    return [
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Blocked', value: 'Blocked' },
      { label: 'Not Started', value: 'Not Started' }
    ];
  }
  
  if (property === 'priority') {
    return [
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
      { label: 'Critical', value: 'Critical' }
    ];
  }
  
  return [];
};

export const useFilter = (property: keyof daily): FilterOption[] => {
  const { dailyReports, refreshDailyReports } = useDaily();
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>(getDefaultOptions(property));

  useEffect(() => {
    refreshDailyReports();
  }, [refreshDailyReports]);

  useEffect(() => {
    try {
      const uniqueValues = getUniqueValues(dailyReports, property);
      if (uniqueValues.length > 0) {
        setFilterOptions(uniqueValues);
      } else {
        // If no values are found in daily reports, use defaults
        setFilterOptions(getDefaultOptions(property));
      }
    } catch (error) {
      console.error('Error processing filter options:', error);
      setFilterOptions(getDefaultOptions(property));
    }
  }, [dailyReports, property]);

  return filterOptions;
}; 