"use client";

import { DailyContextProps, Daily } from './type';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getDailies, 
  getDaily, 
  createDaily, 
  updateDaily, 
  deleteDaily, 
  syncTasksWithDailies as syncTasksAction 
} from './actions';
import { DailyFormValues } from './validation';

const DailyContext = createContext<DailyContextProps | undefined>(undefined);

export const useDaily = () => {
  const context = useContext(DailyContext);
  if (!context) {
    throw new Error('useDaily must be used within a DailyProvider');
  }
  return context;
};

const DailyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [daily, setDaily] = useState<Daily | null>(null);
  const [dailyReports, setDailyReports] = useState<Daily[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDaily = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await getDaily(id);
      if (response.success && response.daily) {
        setDaily(response.daily);
      } else {
        console.error('Error fetching daily:', response.error);
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDailies();
      if (response.success && response.dailies) {
        setDailyReports(response.dailies);
      } else {
        console.error('Error fetching dailies:', response.error);
        setDailyReports([]);
      }
    } catch (error) {
      console.error('Error fetching daily reports:', error);
      setDailyReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDailyReports = useCallback(() => {
    fetchDailyReports();
  }, [fetchDailyReports]);

  const handleDeleteDaily = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteDaily(id);
      if (response.success) {
        refreshDailyReports();
      } else {
        console.error('Error deleting daily:', response.error);
      }
    } catch (error) {
      console.error('Error deleting daily report:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshDailyReports]);

  const handleCreateDaily = useCallback(async (data: Partial<DailyFormValues>) => {
    try {
      setLoading(true);
      const response = await createDaily(data);
      if (response.success) {
        refreshDailyReports();
      } else {
        console.error('Error creating daily:', response.error);
      }
    } catch (error) {
      console.error('Error creating daily report:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshDailyReports]);

  const handleUpdateDaily = useCallback(async (id: string, data: Partial<DailyFormValues>) => {
    try {
      setLoading(true);
      const response = await updateDaily(id, data);
      if (response.success) {
        refreshDailyReports();
      } else {
        console.error('Error updating daily:', response.error);
      }
    } catch (error) {
      console.error('Error updating daily report:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshDailyReports]);

  const handleSyncTasksWithDailies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await syncTasksAction();
      if (response.success) {
        refreshDailyReports();
        return response;
      } else {
        console.error('Error syncing tasks with dailies:', response.error);
        return response;
      }
    } catch (error: any) {
      console.error('Error syncing tasks with dailies:', error);
      return { error: error.message || 'Failed to sync' };
    } finally {
      setLoading(false);
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
        loading,
        fetchDaily,
        fetchDailyReports,
        refreshDailyReports,
        deleteDaily: handleDeleteDaily,
        createDaily: handleCreateDaily,
        updateDaily: handleUpdateDaily,
        syncTasksWithDailies: handleSyncTasksWithDailies,
      }}
    >
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider; 