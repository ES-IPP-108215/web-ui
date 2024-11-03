import { TaskState, TaskResponse } from '@/lib/types'

export const priorityColors = {
  low: 'bg-green-200 text-green-700',
  medium: 'bg-yellow-200 text-yellow-700',
  high: 'bg-red-200 text-red-700',
}

export const formatState = (state: TaskState): string => {
  switch (state) {
    case 'to_do':
      return 'To Do'
    case 'in_progress':
      return 'In Progress'
    case 'done':
      return 'Done'
    default:
      return state
  }
}

export const stateOrder = {
  'to_do': 0,
  'in_progress': 1,
  'done': 2
}

export const customSort = (a: TaskResponse, b: TaskResponse, isAsc: boolean) => {
  const orderA = stateOrder[a.state]
  const orderB = stateOrder[b.state]
  return isAsc ? orderA - orderB : orderB - orderA
}