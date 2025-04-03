import Header from '@/components/wallet/layout/header'
import React, { ReactNode } from 'react'

const Layout = (props: {children: ReactNode}) => {
  return (
    <div>
      <Header  />
      <main className="mt-10">
      {props.children}
      </main>
    </div>
  )
}

export default Layout