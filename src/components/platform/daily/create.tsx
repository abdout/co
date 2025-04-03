'use client'

import { useState } from 'react'
import { useDaily } from './context'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Icon } from '@iconify/react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface CreateProps {
  onClose: () => void
}

export default function Create({ onClose }: CreateProps) {
  const { createDaily } = useDaily()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  
  // Hardcoded sample projects for demo
  const sampleProjects = [
    { _id: '1', name: 'Project Alpha' },
    { _id: '2', name: 'Project Beta' },
    { _id: '3', name: 'Project Gamma' },
  ]

  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      project: '',
      status: 'in-progress',
      priority: 'medium',
      hoursSpent: 0,
      completionPercentage: 0,
      blockers: '',
      plannedTomorrow: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, setValue } = methods

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      await createDaily({
        ...data,
        date: format(date, "yyyy-MM-dd"),
        engineer: 'Current User',
      })
      setLoading(false)
      onClose()
    } catch (error) {
      console.error('Failed to create daily report:', error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create Daily Report</CardTitle>
        <CardDescription>Add a new daily report to track your progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Daily report title"
                {...register('title', { required: 'Title is required' })}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message?.toString()}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                onValueChange={(value) => setValue('project', value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {sampleProjects.map((project) => (
                    <SelectItem key={project._id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <p className="text-red-500 text-xs mt-1">{errors.project.message?.toString()}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What did you work on today?"
                {...register('description', { required: 'Description is required' })}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message?.toString()}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue('status', value)}
                  defaultValue="in-progress"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) => setValue('priority', value)}
                  defaultValue="medium"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hours Spent and Completion Percentage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoursSpent">Hours Spent</Label>
                <Input
                  id="hoursSpent"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  {...register('hoursSpent', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Hours cannot be negative' }
                  })}
                  className={errors.hoursSpent ? 'border-red-500' : ''}
                />
                {errors.hoursSpent && (
                  <p className="text-red-500 text-xs mt-1">{errors.hoursSpent.message?.toString()}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionPercentage">Completion (%)</Label>
                <Input
                  id="completionPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  placeholder="0"
                  {...register('completionPercentage', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Percentage cannot be below 0' },
                    max: { value: 100, message: 'Percentage cannot exceed 100' }
                  })}
                  className={errors.completionPercentage ? 'border-red-500' : ''}
                />
                {errors.completionPercentage && (
                  <p className="text-red-500 text-xs mt-1">{errors.completionPercentage.message?.toString()}</p>
                )}
              </div>
            </div>

            {/* Blockers */}
            <div className="space-y-2">
              <Label htmlFor="blockers">Blockers</Label>
              <Textarea
                id="blockers"
                placeholder="Any blockers or issues you're facing?"
                {...register('blockers')}
                rows={2}
              />
            </div>

            {/* Planned for Tomorrow */}
            <div className="space-y-2">
              <Label htmlFor="plannedTomorrow">Planned for Tomorrow</Label>
              <Textarea
                id="plannedTomorrow"
                placeholder="What do you plan to work on tomorrow?"
                {...register('plannedTomorrow')}
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Daily Report'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
} 