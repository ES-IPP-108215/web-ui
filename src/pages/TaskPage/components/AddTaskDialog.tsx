import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { TaskService } from '@/services/Client/TaskService'
import { TaskForm, TaskFormData } from './TaskForm'

export function AddTaskDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const addTask = async (data: TaskFormData) => {
    let apiTaskData: any = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      state: data.state,
    }

    if (data.includeDeadline && data.deadline.date) {
      const deadlineDate = new Date(data.deadline.date)
      if (data.deadline.time) {
        const [hours, minutes] = data.deadline.time.split(':').map(Number)
        deadlineDate.setHours(hours, minutes)
      } else {
        deadlineDate.setHours(0, 0, 0, 0)
      }
      apiTaskData.deadline = deadlineDate.toISOString()
    }
    
    const task = await TaskService.createTask(apiTaskData)
    await queryClient.invalidateQueries('tasks')

    return task.data
  }

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Task Created',
        description: 'Your task has been created successfully',
      })
      setIsOpen(false)
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Task Creation Failed',
        description: error.message,
      })
    },
  })

  function onSubmit(data: TaskFormData) {
    addTaskMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-xl py-6 px-8" onClick={() => setIsOpen(true)}>
          <CalendarIcon className="h-6 w-6 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={onSubmit}
          submitButtonText="Add Task"
          isSubmitting={addTaskMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}