'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag, AlertTriangle, CheckCircle2, AlertCircle, Trash2, FileText, BookOpen, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getTask, deleteTask } from '@/components/platform/task/actions';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/components/platform/task/constant';
import { format } from 'date-fns';
import { toast } from 'sonner';
import TaskForm from '@/components/platform/task/form';
import Loading from '@/components/atom/loading';

const TaskDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const taskId = params.id as string;
        const result = await getTask(taskId);
        
        if (result.error) {
          toast.error(result.error);
          return;
        }
        
        setTask(result.task);
      } catch (error) {
        console.error('Error fetching task details:', error);
        toast.error('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleDeleteTask = async () => {
    if (!task?._id) return;
    
    try {
      setDeleting(true);
      const result = await deleteTask(task._id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success('Task deleted successfully');
      router.push('/task');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSuccess = async () => {
    // Refresh task data
    const result = await getTask(params.id as string);
    if (!result.error) {
      setTask(result.task);
    }
    setShowEditForm(false);
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Loading />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="py-10">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold mt-4">Task Not Found</h2>
            <p className="text-muted-foreground mt-2">The requested task could not be found or has been deleted.</p>
            <Button onClick={handleBack} className="mt-6">
              Return to Task List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format date if it exists
  const formattedDate = task.date ? format(new Date(task.date), 'PPP') : 'Not set';
  
  // Get status and priority labels
  const statusLabel = TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS] || task.status;
  const priorityLabel = TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS] || task.priority;
  
  // Status colors
  const statusColors: Record<string, string> = {
    'pending': 'bg-gray-400',
    'stuck': 'bg-red-400',
    'in_progress': 'bg-blue-400',
    'done': 'bg-green-400'
  };
  
  // Priority colors
  const priorityColors: Record<string, string> = {
    'high': 'bg-red-400',
    'medium': 'bg-yellow-400',
    'low': 'bg-blue-400',
    'pending': 'bg-gray-400'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Details</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowEditForm(true)}
          >
            Edit Task
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteTask}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : <><Trash2 className="h-4 w-4 mr-2" /> Delete Task</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main task info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{task.task}</h2>
                <p className="text-muted-foreground mt-1">{task.project}</p>
              </div>
              <div className="flex space-x-2">
                <Badge className={`${statusColors[task.status] || 'bg-gray-400'} text-white`}>
                  {statusLabel}
                </Badge>
                <Badge className={`${priorityColors[task.priority] || 'bg-gray-400'} text-white`}>
                  {priorityLabel}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {task.desc || 'No description provided'}
                </p>
              </div>
              
              <Separator />
              
              {/* Tags and labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    System
                  </h3>
                  <p>{task.tag || 'None'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Category
                  </h3>
                  <p>{task.label || 'None'}</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Remarks */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Remarks
                </h3>
                <p className="text-muted-foreground">
                  {task.remark || 'No remarks'}
                </p>
              </div>
              
              {/* Activities */}
              {task.linkedActivity && Object.values(task.linkedActivity).some(value => value) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Linked Activities</h3>
                    <div className="bg-muted rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {task.linkedActivity.projectId && (
                          <div>
                            <h4 className="text-sm font-medium">Project ID</h4>
                            <p>{task.linkedActivity.projectId}</p>
                          </div>
                        )}
                        {task.linkedActivity.system && (
                          <div>
                            <h4 className="text-sm font-medium">System</h4>
                            <p>{task.linkedActivity.system}</p>
                          </div>
                        )}
                        {task.linkedActivity.category && (
                          <div>
                            <h4 className="text-sm font-medium">Category</h4>
                            <p>{task.linkedActivity.category}</p>
                          </div>
                        )}
                        {task.linkedActivity.subcategory && (
                          <div>
                            <h4 className="text-sm font-medium">Subcategory</h4>
                            <p>{task.linkedActivity.subcategory}</p>
                          </div>
                        )}
                        {task.linkedActivity.activity && (
                          <div>
                            <h4 className="text-sm font-medium">Activity</h4>
                            <p>{task.linkedActivity.activity}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Documentation */}
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-md p-4 flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-2 text-blue-500" />
                    <h4 className="font-medium">Manuals</h4>
                    <p className="text-sm text-muted-foreground mb-3">Operation & maintenance guides</p>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4 flex flex-col items-center text-center">
                    <BookOpen className="h-8 w-8 mb-2 text-yellow-500" />
                    <h4 className="font-medium">MOS</h4>
                    <p className="text-sm text-muted-foreground mb-3">Method of statement docs</p>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4 flex flex-col items-center text-center">
                    <FileSpreadsheet className="h-8 w-8 mb-2 text-green-500" />
                    <h4 className="font-medium">Reports</h4>
                    <p className="text-sm text-muted-foreground mb-3">Progress & status reports</p>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  Created: {task.createdAt ? format(new Date(task.createdAt), 'PPP') : 'Unknown'}
                </div>
                <div>
                  Last Updated: {task.updatedAt ? format(new Date(task.updatedAt), 'PPP') : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Side panel with additional info */}
        <div>
          <div className="bg-background p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium">Task Details</h3>
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Due Date
              </h4>
              <p>{formattedDate}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Duration
              </h4>
              <p>{task.duration || '0'} hours</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-1">Overtime</h4>
              <p>{task.overtime || '0'} hours</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Assigned To</h4>
              {task.assignedTo && task.assignedTo.length > 0 ? (
                <div className="space-y-2">
                  {task.assignedTo.map((member: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No team members assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <TaskForm 
          taskToEdit={task}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default TaskDetail;