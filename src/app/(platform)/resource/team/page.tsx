import TeamContent from '@/components/team/content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Team Members | Company Underway",
  description: "View and manage team members",
};

const Team = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <TeamContent />
    </div>
  )
}

export default Team