'use client'

import { useDaily } from '@/components/platform/daily/context'
import { columns } from '@/components/platform/daily/coloum'
import { Content } from '@/components/platform/daily/content'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import ModalProvider from '@/components/atom/modal/provider'
import { useModal } from '@/components/atom/modal/context'
import Create from '@/components/platform/daily/create'

const Page = () => {
  const { dailyReports, refreshDailyReports, loading } = useDaily()
  const { modal, openModal, closeModal } = useModal()
  
  const handleRefresh = () => {
    refreshDailyReports()
  }
  
  const handleCloseModal = () => {
    closeModal()
    refreshDailyReports()
  }

  return (
    <ModalProvider>
      <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Reports</h2>
            <p className="text-muted-foreground">
              Track your daily progress and activities across projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              {loading ? (
                <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icon icon="lucide:refresh-cw" className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button onClick={() => openModal(null)}>
              <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
              New Daily Report
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <Content columns={columns} data={dailyReports || []} />
        </div>
      </div>
      {modal.open && modal.id === null && <Create onClose={handleCloseModal} />}
    </ModalProvider>
  )
}

export default Page 