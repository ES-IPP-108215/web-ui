import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type TaskStatus = 'todo' | 'doing' | 'finished'

type Task = {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: TaskStatus
}

const initialTasks: Task[] = [
  { id: '1', title: 'Create project proposal', priority: 'high', status: 'todo' },
  { id: '2', title: 'Review documentation', priority: 'medium', status: 'todo' },
  { id: '3', title: 'Prepare presentation', priority: 'low', status: 'todo' },
  { id: '4', title: 'Implement new feature', priority: 'high', status: 'doing' },
  { id: '5', title: 'Test integrations', priority: 'medium', status: 'doing' },
  { id: '6', title: 'Update dependencies', priority: 'low', status: 'finished' },
  { id: '7', title: 'Fix critical bug', priority: 'high', status: 'finished' },
  { id: '8', title: 'Optimize database queries', priority: 'medium', status: 'finished' },
]

const priorityColors = {
  low: 'bg-green-300',
  medium: 'bg-yellow-200',
  high: 'bg-red-300',
}

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent, taskId: string) => void }> = ({ task, onDragStart }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Card 
      className="mb-2 cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <span className="text-sm">{task.title}</span>
        <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
      </CardContent>
    </Card>
  </motion.div>
)

const TaskColumn: React.FC<{ 
  title: string; 
  tasks: Task[]; 
  status: TaskStatus;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
}> = ({ title, tasks, status, onDragStart, onDragOver, onDrop }) => (
  <Card className="flex-1 min-w-[300px] h-full flex flex-col">
    <CardHeader className="text-center">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent 
      className="flex-grow overflow-y-auto"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
      ))}
    </CardContent>
  </Card>
)

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId')
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Board</h1>
      <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
        <TaskColumn 
          title="To Do" 
          tasks={tasks.filter(task => task.status === 'todo')} 
          status="todo"
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
        <TaskColumn 
          title="Doing" 
          tasks={tasks.filter(task => task.status === 'doing')} 
          status="doing"
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
        <TaskColumn 
          title="Finished" 
          tasks={tasks.filter(task => task.status === 'finished')} 
          status="finished"
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      </div>
    </div>
  )
}