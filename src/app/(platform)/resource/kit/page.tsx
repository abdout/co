import KitContent from '@/components/kit/content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kits | Company Underway",
  description: "View and manage equipment kits",
};

const Kit = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <KitContent />
    </div>
  )
}

export default Kit