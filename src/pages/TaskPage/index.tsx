"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  VisibilityState,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { useUserStore } from "@/stores/useUserStore"
import { UserService } from "@/services/Client/UserService"
import { TaskService } from "@/services/Client/TaskService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Eye, Trash2, Edit2, List, Grid, ArrowUpDown, RotateCcw, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskColumn } from "./components/TaskColumn"
import { TaskResponse, TaskState } from "@/lib/types"
import { priorityColors, formatState, stateOrder, customSort } from '@/utils/taskUtils'
import { TaskDetailsDialog } from "./components/TaskDetailsDialog"
import { AddTaskDialog } from "./components/AddTaskDialog"
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { EditTaskDialog } from "./components/EditTaskDialog"


const initialTasks: TaskResponse[] = []

export default function TaskPage() {
  const [tasks, setTasks] = React.useState<TaskResponse[]>(initialTasks)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [customColumns, setCustomColumns] = React.useState<string[]>([])
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const { token, setUserInformation } = useUserStore()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [taskIdToEdit, setTaskIdToEdit] = useState<string | null>(null)
  //fetch user information

  const fetchUser = async () => {
    const response = await UserService.getUser()
    return response.data
  }

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  })


  //fetch tasks
  const fetchTasks = async () => {
    const response = await TaskService.getTasks()

    console.log(response.data)
    return response.data
  }

  const { data: tasksData } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    enabled: !!token,
  })


  //delete task
  const deleteTask = async (taskId: string) => {
    await TaskService.deleteTask(taskId)
    return taskId
  }

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (taskId) => {
      setTasks(tasks.filter(task => task.id !== taskId))
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: async (updateData: Partial<TaskResponse>) => {
      const response = await TaskService.updateTask(updateData.id!, updateData)
      return response.data
    },
    onMutate: async (updateData) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData(['tasks'])
      queryClient.setQueryData(['tasks'], (old: TaskResponse[] | undefined) => {
        return old?.map(task => 
          task.id === updateData.id ? { ...task, ...updateData } : task
        )
      })
      return { previousTasks }
    },
    onSuccess: (updatedTask) => {
      toast({
        variant: 'success',
        title: 'Update Successful',
        description: `Task "${updatedTask.title}" has been updated.`,
      })
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update task. Please try again.',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })


  useEffect(() => {
    if (data && token) {
      setUserInformation(data)
    }
    if (tasksData) {
      setTasks(tasksData)
    }
  }, [data, setUserInformation, token, tasksData])


  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newState: TaskState) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    const task = tasks.find(t => t.id === id)
    
    if (task && task.state !== newState) {
      updateTaskMutation.mutate({ id, state: newState })
    }
  }

  const onEdit = (taskId: string) => {
    setTaskIdToEdit(taskId)
  }

  const handleEditSubmit = (updatedTask: TaskResponse) => {
    updateTaskMutation.mutate(updatedTask)
  }



  const onDelete = (taskId: string) => {
    setTaskToDelete(taskId)
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate(taskToDelete)
      setTaskToDelete(null)
    }
  }

  const cancelDelete = () => {
    setTaskToDelete(null)
  }

  const resetSorting = () => {
    setSorting([])
  }

  const removeCustomColumn = (columnName: string) => {
    setCustomColumns(customColumns.filter(col => col !== columnName))
    setColumnVisibility({ ...columnVisibility, [columnName]: false })
  }

  const defaultColumns: ColumnDef<TaskResponse>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg"
          >
            Title
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-lg">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="truncate max-w-[300px] text-lg">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg"
          >
            Priority
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return (
          <Badge className={`${priorityColors[priority as keyof typeof priorityColors]} text-lg px-3 py-1`}>
            {priority}
          </Badge>
        )
      },
    },
    {
      accessorKey: "state",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg"
          >
            State
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-lg">{formatState(row.getValue("state"))}</div>,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as TaskState
        const b = rowB.getValue(columnId) as TaskState
        return stateOrder[a] - stateOrder[b]
      },
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg"
          >
            Deadline
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const deadline = row.getValue("deadline")
        return (
          <div className="text-lg">
            {deadline && new Date(deadline as string).getTime() > 0
              ? format(new Date(deadline as string), 'PP')
              : 'Not defined'}
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg"
          >
            Created At
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-lg">{format(new Date(row.getValue("created_at")), 'PP')}</div>,
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            
            className="text-lg"
          >
            Updated At
            <ArrowUpDown className="ml-2 h-5 w-5" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-lg">{format(new Date(row.getValue("updated_at")), 'PP')}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex space-x-2">
            <TaskDetailsDialog task={task} />
            <Button variant="outline" size="sm" onClick={() => onEdit(task.id)} className="text-lg h-10">
              <Edit2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(task.id)} className="text-lg h-10">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )
      },
    },
  ]

  const customColumnDefs: ColumnDef<TaskResponse>[] = customColumns.map(columnName => ({
    accessorKey: columnName,
    header: columnName,
    cell: ({ row }) => <div className="text-lg">{row.getValue(columnName) || "N/A"}</div>,
  }))

  const allColumns = [...defaultColumns, ...customColumnDefs]

  const table = useReactTable({
    data: tasks,
    columns: allColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="container mx-auto p-6 sm:p-8 lg:p-10 flex flex-col min-h-screen text-lg">
      <div className="flex justify-between items-center mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold">Task Board</h1>
        <AddTaskDialog/>
      </div>
      <div className="mb-6 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            onClick={() => setViewMode('card')}
            className="text-lg py-6 px-8"
          >
            <Grid className="h-6 w-6 mr-3" />
            Card View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="text-lg py-6 px-8"
          >
            <List className="h-6 w-6 mr-3" />
            List View
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search tasks..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm text-lg py-6"
          />
          <Select
            value={(table.getColumn("state")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => table.getColumn("state")?.setFilterValue(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[200px] text-lg py-6">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="to_do">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select
          value={sorting.length > 0 ? `${sorting[0].id}-${sorting[0].desc ? 'desc' : 'asc'}` : 'default'}
          onValueChange={(value) => {
            if (value === 'default') {
              setSorting([])
            } else if (value === 'state-asc' || value === 'state-desc') {
              const isAsc = value === 'state-asc'
              setTasks([...tasks].sort((a, b) => customSort(a, b, isAsc)))
              setSorting([{ id: 'state', desc: !isAsc }])
            } else {
              const [id, direction] = value.split('-')
              setSorting([{ id, desc: direction === 'desc' }])
            }
          }}
        >
          <SelectTrigger className="w-[200px] text-lg py-6">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="priority-asc">Priority (Low-High)</SelectItem>
            <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
            <SelectItem value="deadline-asc">Deadline (Earliest)</SelectItem>
            <SelectItem value="deadline-desc">Deadline (Latest)</SelectItem>
            <SelectItem value="created_at-asc">Created (Oldest)</SelectItem>
            <SelectItem value="created_at-desc">Created (Newest)</SelectItem>
            <SelectItem value="state-asc">State (To Do → Done)</SelectItem>
            <SelectItem value="state-desc">State (Done → To Do)</SelectItem>
          </SelectContent>
        </Select>
          <Button onClick={resetSorting} className="text-lg py-6 px-8">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset Sorting
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-lg py-6 px-8">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {viewMode === 'card' ? (
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 overflow-hidden">
          <TaskColumn 
            title="To Do" 
            tasks={table.getRowModel().rows
              .filter(row => row.original.state === 'to_do')
              .map(row => row.original)} 
            state="to_do"
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <TaskColumn 
            title="In Progress" 
            tasks={table.getRowModel().rows
              .filter(row => row.original.state === 'in_progress')
              .map(row => row.original)}
            state="in_progress"
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <TaskColumn 
            title="Done" 
            tasks={table.getRowModel().rows
              .filter(row => row.original.state === 'done')
              .map(row => row.original)}
            state="done"
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-lg py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {customColumns.includes(header.id) && (
                        <Button
                          variant="ghost"
                          onClick={() => removeCustomColumn(header.id)}
                          className="ml-2 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-lg py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={allColumns.length} className="h-24 text-center text-lg">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {viewMode === 'list' && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-lg text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {tasks.length} task(s).
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-lg py-6 px-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-lg py-6 px-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <DeleteConfirmationDialog
        isOpen={!!taskToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={deleteTaskMutation.isPending}
      />
      {taskIdToEdit && (
        <EditTaskDialog
          taskId={taskIdToEdit}
          onSubmit={handleEditSubmit}
          isOpen={!!taskIdToEdit}
          onOpenChange={(open) => !open && setTaskIdToEdit(null)}
        />
      )}
    </div>
  )
}