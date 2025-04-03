"use client";

import { DailyContextProps, daily } from './type';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DailyContext = createContext<DailyContextProps | undefined>(undefined);

export const useDaily = () => {
  const context = useContext(DailyContext);
  if (!context) {
    throw new Error('useDaily must be used within a DailyProvider');
  }
  return context;
};

const DailyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [daily, setDaily] = useState<daily | null>(null);
  const [dailyReports, setDailyReports] = useState<daily[]>([]);

  const fetchDaily = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/daily/${id}`);
      const data = await response.json();
      setDaily(data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
    }
  }, []);

  const fetchDailyReports = useCallback(async () => {
    try {
      const response = await fetch('/api/daily');
      const data = await response.json();
      setDailyReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching daily reports:', error);
      setDailyReports([]);
    }
  }, []);

  const refreshDailyReports = useCallback(() => {
    fetchDailyReports();
  }, [fetchDailyReports]);

  const deleteDaily = useCallback(async (id: string) => {
    try {
      await fetch(`/api/daily/${id}`, {
        method: 'DELETE',
      });
      refreshDailyReports();
    } catch (error) {
      console.error('Error deleting daily report:', error);
    }
  }, [refreshDailyReports]);

  const createDaily = useCallback(async (data: daily) => {
    try {
      await fetch('/api/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      refreshDailyReports();
    } catch (error) {
      console.error('Error creating daily report:', error);
    }
  }, [refreshDailyReports]);

  const updateDaily = useCallback(async (id: string, data: Partial<daily>) => {
    try {
      await fetch(`/api/daily/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      refreshDailyReports();
    } catch (error) {
      console.error('Error updating daily report:', error);
    }
  }, [refreshDailyReports]);

  useEffect(() => {
    fetchDailyReports();
  }, [fetchDailyReports]);

  return (
    <DailyContext.Provider
      value={{
        daily,
        dailyReports,
        fetchDaily,
        fetchDailyReports,
        refreshDailyReports,
        deleteDaily,
        createDaily,
        updateDaily,
      }}
    >
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider; 