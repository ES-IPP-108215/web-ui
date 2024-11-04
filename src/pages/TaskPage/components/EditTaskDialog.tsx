import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { TaskResponse } from '@/lib/types'
import { TaskService } from '@/services/Client/TaskService'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  includeDeadline: z.boolean().default(false),
  deadline: z.object({
    date: z.date().optional(),
    time: z.string().optional(),
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: "Priority is required",
  }),
  state: z.enum(['to_do', 'in_progress', 'done'], {
    required_error: "State is required",
  }),
})

type TaskFormData = z.infer<typeof taskSchema>

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

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      includeDeadline: false,
      priority: 'low',
      state: 'to_do',
      deadline: {
        date: undefined,
        time: '',
      },
    },
  })

  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        includeDeadline: !!task.deadline,
        priority: task.priority,
        state: task.state,
        deadline: {
          date: task.deadline ? new Date(task.deadline) : undefined,
          time: task.deadline ? format(new Date(task.deadline), 'HH:mm') : '',
        },
      })
    }
  }, [task, form])

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} className="text-lg py-6" />
                  </FormControl>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} className="text-lg py-3" />
                  </FormControl>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="includeDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-xl">
                      Include Deadline
                    </FormLabel>
                    <FormDescription>
                      Check this if you want to set a deadline for the task
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {form.watch('includeDeadline') && (
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="deadline.date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl">Deadline Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal text-lg py-6",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="text-lg"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline.time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xl">Deadline Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            type="time"
                            {...field}
                            className="text-lg py-6"
                          />
                          <Clock className="ml-2 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-lg" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg py-6">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low" className="text-lg py-3">Low</SelectItem>
                      <SelectItem value="medium" className="text-lg py-3">Medium</SelectItem>
                      <SelectItem value="high" className="text-lg py-3">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg py-6">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="to_do" className="text-lg py-3">To Do</SelectItem>
                      <SelectItem value="in_progress" className="text-lg py-3">In Progress</SelectItem>
                      <SelectItem value="done" className="text-lg py-3">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
            <Button type="submit" className="text-xl py-6 px-8">
              Update Task
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}