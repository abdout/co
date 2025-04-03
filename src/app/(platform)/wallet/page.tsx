import Footer from '@/components/wallet/timesheet/footer'
import Header from '@/components/wallet/timesheet/header'
import TimeList from '@/components/wallet/timesheet/list'
import React from 'react'

const Timesheet = () => {
  return (
    <div className="min-h-screen bg-white pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="mt-8">
          <TimeList />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Timesheet