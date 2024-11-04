import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskResponse } from '@/lib/types'
import { TaskService } from '@/services/Client/TaskService'
import { TaskForm, TaskFormData } from './TaskForm'

interface EditTaskDialogProps {
  taskId: string
  onSubmit: (updatedTask: TaskResponse) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ taskId, onSubmit, isOpen, onOpenChange }: EditTaskDialogProps) {
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => TaskService.getTask(taskId).then(response => response.data),
    enabled: isOpen,
  })

  const handleSubmit = (data: TaskFormData) => {
    if (!task) return

    const updatedTask: TaskResponse = {
      ...task,
      ...data,
      deadline: data.includeDeadline && data.deadline.date
        ? new Date(
            data.deadline.date.setHours(
              ...(data.deadline.time?.split(':').map(Number) || [0, 0])
            )
          ).toISOString()
        : null,
    }
    onSubmit(updatedTask)
    onOpenChange(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        {task && (
          <TaskForm
            initialData={task}
            onSubmit={handleSubmit}
            submitButtonText="Update Task"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}