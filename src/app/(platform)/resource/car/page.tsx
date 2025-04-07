import { Metadata } from 'next'
import CarPage from './client'

export const metadata: Metadata = {
  title: "Cars | Company Underway",
  description: "View and manage company cars",
};

const Car = () => {
  return <CarPage />
}

export default Car