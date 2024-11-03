import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskCard } from './TaskCard'
import { TaskResponse, TaskState } from '@/lib/types'

interface TaskColumnProps {
  title: string
  tasks: TaskResponse[]
  state: TaskState
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, state: TaskState) => void
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, tasks, state, onDragStart, onDragOver, onDrop, onEdit, onDelete 
}) => (
  <Card className="flex-1 min-w-[350px] h-full flex flex-col bg-slate-50/50">
    <CardHeader className="text-center py-6">
      <CardTitle className="text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent 
      className="flex-grow overflow-y-auto px-4"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, state)}
    >
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onDragStart={onDragStart}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </CardContent>
  </Card>
)