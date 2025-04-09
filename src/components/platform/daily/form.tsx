'use client'

import { useState } from 'react'
import { useDaily } from './context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { dailyFormSchema, DailyFormValues } from './validation'
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
import { DAILY_STATUS_OPTIONS, DAILY_PRIORITY_OPTIONS } from './constant'
import { Daily } from './type'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

interface DailyFormProps {
  onClose: () => void
  initialData?: Daily
  mode?: 'create' | 'edit'
}

export default function DailyForm({ onClose, initialData, mode = 'create' }: DailyFormProps) {
  const { createDaily, updateDaily } = useDaily()
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  )
  
  // Fetch projects from the API
  const [projects, setProjects] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Project Beta' },
    { id: '3', name: 'Project Gamma' },
  ])

  const form = useForm<DailyFormValues>({
    resolver: zodResolver(dailyFormSchema),
    defaultValues: {
      task: initialData?.task || '',
      description: initialData?.description || '',
      project: initialData?.project || '',
      status: initialData?.status || '',
      priority: initialData?.priority || '',
      hoursSpent: initialData?.hoursSpent || '0',
      completionPercentage: initialData?.completionPercentage || '0',
      blockers: initialData?.blockers || '',
      plannedTomorrow: initialData?.plannedTomorrow || '',
    }
  })
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = form

  async function onSubmit(data: DailyFormValues) {
    try {
      // Prepare the data with the date
      const submitData = {
        ...data,
        date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        engineer: initialData?.engineer || 'Current User', // This would be replaced with actual user data in a real app
      }
      
      if (mode === 'create') {
        await createDaily(submitData)
      } else if (mode === 'edit' && initialData?.id) {
        await updateDaily(initialData.id, submitData)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to submit daily report:', error)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {mode === 'create' ? 'Create Daily Report' : 'Edit Daily Report'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Add a new daily report to track your progress.' 
            : 'Update your daily report to reflect your current progress.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Task */}
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    onSelect={(date) => setDate(date)}
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
                defaultValue={initialData?.project || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <p className="text-red-500 text-xs mt-1">{errors.project.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What did you work on today?"
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue('status', value)}
                  defaultValue={initialData?.status || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAILY_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) => setValue('priority', value)}
                  defaultValue={initialData?.priority || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAILY_PRIORITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>
                )}
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
                  {...register('hoursSpent')}
                  className={errors.hoursSpent ? 'border-red-500' : ''}
                />
                {errors.hoursSpent && (
                  <p className="text-red-500 text-xs mt-1">{errors.hoursSpent.message}</p>
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
                  {...register('completionPercentage')}
                  className={errors.completionPercentage ? 'border-red-500' : ''}
                />
                {errors.completionPercentage && (
                  <p className="text-red-500 text-xs mt-1">{errors.completionPercentage.message}</p>
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
              {errors.blockers && (
                <p className="text-red-500 text-xs mt-1">{errors.blockers.message}</p>
              )}
            </div>

            {/* Planned for Tomorrow */}
            <div className="space-y-2">
              <Label htmlFor="plannedTomorrow">Planned for Tomorrow</Label>
              <Textarea
                id="plannedTomorrow"
                placeholder="What are you planning to work on tomorrow?"
                {...register('plannedTomorrow')}
                rows={2}
              />
              {errors.plannedTomorrow && (
                <p className="text-red-500 text-xs mt-1">{errors.plannedTomorrow.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    {mode === 'create' ? 'Create Report' : 'Update Report'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 