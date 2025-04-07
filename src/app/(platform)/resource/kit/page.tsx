import { Metadata } from 'next'
import KitPage from './client'

export const metadata: Metadata = {
  title: "Kits | Company Underway",
  description: "View and manage equipment kits",
};

const Kit = () => {
  return <KitPage />
}

export default Kit