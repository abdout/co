'use client'

import { useState } from 'react'
import { useDaily } from './context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icon } from '@iconify/react'
import { Daily } from './type'

interface DeleteDailyProps {
  daily: Daily
  onClose: () => void
}

export default function DeleteDaily({ daily, onClose }: DeleteDailyProps) {
  const { deleteDaily } = useDaily()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      if (daily.id) {
        await deleteDaily(daily.id)
      }
      onClose()
    } catch (error) {
      console.error('Error deleting daily:', error)
      setIsDeleting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Delete Daily Report</CardTitle>
        <CardDescription>
          Are you sure you want to delete this daily report? This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start">
            <Icon icon="lucide:file-text" className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <h3 className="font-medium">{daily.title || 'Untitled Daily Report'}</h3>
              <p className="text-sm text-gray-500">{daily.date || 'No date'}</p>
            </div>
          </div>
          {daily.project && (
            <div className="flex items-start">
              <Icon icon="lucide:briefcase" className="h-5 w-5 mr-2 text-gray-500" />
              <p>{daily.project}</p>
            </div>
          )}
          {daily.status && (
            <div className="flex items-start">
              <Icon icon="lucide:activity" className="h-5 w-5 mr-2 text-gray-500" />
              <p>{daily.status}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete Report'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 