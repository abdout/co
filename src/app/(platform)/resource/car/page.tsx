import CarContent from '@/components/car/content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cars | Company Underway",
  description: "View and manage company cars",
};

const Car = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <CarContent />
    </div>
  )
}

export default Car