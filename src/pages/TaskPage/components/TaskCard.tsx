import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, Trash2, Edit2 } from 'lucide-react'
import { TaskResponse, TaskState } from '@/lib/types'
import { priorityColors, formatState } from '@/utils/taskUtils'

interface TaskCardProps {
  task: TaskResponse
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onEdit, onDelete }) => (
  <Card 
    className="mb-4 bg-white dark:bg-background cursor-move hover:shadow-md transition-shadow"
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold">{task.title}</h3>
        <Badge className={`${priorityColors[task.priority]} text-lg px-3 py-1`}>
          {task.priority}
        </Badge>
      </div>
      <p className="text-lg mb-3 line-clamp-2">{task.description}</p>
      <div className="text-lg mb-3">
        <span className="font-semibold">Deadline:</span> {format(new Date(task.deadline), 'PP')}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-lg">
          <span className="font-semibold">Status:</span> {formatState(task.state)}
        </div>
        <div className="flex space-x-2">
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
          <Button variant="outline" size="sm" onClick={() => onEdit(task.id)} className="text-lg h-10">
            <Edit2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(task.id)} className="text-lg h-10">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)