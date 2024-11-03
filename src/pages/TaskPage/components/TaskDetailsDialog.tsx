import React from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { TaskResponse } from '@/lib/types'
import { priorityColors, formatState } from '@/utils/taskUtils'

interface TaskDetailsDialogProps {
  task: TaskResponse
}

export const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({ task }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-lg h-10">
          <Eye className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4">{task.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 text-lg">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Description:</span>
            <p className="col-span-3">{task.description}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Priority:</span>
            <Badge className={`${priorityColors[task.priority]} text-lg px-3 py-1`}>
              {task.priority}
            </Badge>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Deadline:</span>
            <span>{format(new Date(task.deadline), 'PPP')}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <span>{formatState(task.state)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Created:</span>
            <span>{format(new Date(task.created_at), 'PPP')}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Updated:</span>
            <span>{format(new Date(task.updated_at), 'PPP')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}