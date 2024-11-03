import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { TaskResponse } from '@/lib/types'
import { priorityColors, formatState } from '@/utils/taskUtils'
import { TaskDetailsDialog } from './TaskDetailsDialog'

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
        <span className="font-semibold">Deadline:</span>{' '}
        {task.deadline && new Date(task.deadline).getTime() > 0
          ? format(new Date(task.deadline), 'PP')
          : 'Not defined'}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-lg">
          <span className="font-semibold">Status:</span> {formatState(task.state)}
        </div>
        <div className="flex space-x-2">
          <TaskDetailsDialog task={task} />
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