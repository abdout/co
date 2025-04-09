'use client'

import React, { useState, useEffect } from 'react'
import { useDaily } from '@/components/platform/daily/context'
import { getColumns } from '@/components/platform/daily/coloum'
import { Content } from '@/components/platform/daily/content'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useModal } from '@/components/atom/modal/context'
import DailyForm from '@/components/platform/daily/form'
import DeleteDaily from '@/components/platform/daily/delete'
import { Daily } from '@/components/platform/daily/type'

const DailyPage = () => {
  const { dailyReports, refreshDailyReports, loading } = useDaily()
  const router = useRouter()
  const { modal, openModal, closeModal } = useModal()
  
  const fetchDailies = async () => {
    try {
      refreshDailyReports()
    } catch (error) {
      console.error('Exception in fetchDailies:', error)
      toast.error('Failed to fetch daily reports')
    }
  }
  
  // Get columns with the fetchDailies function
  const columns = getColumns(fetchDailies);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchDailies()
  }, [])
  
  const handleCloseModal = () => {
    closeModal()
    refreshDailyReports()
  }

  const handleRowClick = (daily: Daily, event: React.MouseEvent<HTMLElement>) => {
    // Check if the click was on an action button or dialog
    const target = event.target as HTMLElement
    const actionButton = target.closest('[data-action="no-navigate"]')
    
    if (actionButton) {
      // If clicked on an action button, don't navigate
      return
    }
    
    // Use daily.id if available
    const dailyId = daily.id || daily._id
    router.push(`/daily/${dailyId}`)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-heading">Daily</h1>
          <p className="text-muted-foreground">Manage. track.</p>
        </div>
      </div>
      
      <Content 
        columns={columns} 
        data={dailyReports || []} 
        onTasksChange={fetchDailies}
        onRowClick={handleRowClick}
      />
      
      {modal.open && modal.id === 'new-daily' && (
        <DailyForm onClose={handleCloseModal} mode="create" />
      )}
      {modal.open && modal.id === 'edit-daily' && modal.data && (
        <DailyForm
          onClose={handleCloseModal}
          initialData={modal.data as Daily}
          mode="edit"
        />
      )}
      {modal.open && modal.id === 'delete-daily' && modal.data && (
        <DeleteDaily
          daily={modal.data as Daily}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default DailyPage 