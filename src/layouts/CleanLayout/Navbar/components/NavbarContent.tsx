import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  SquareTerminal,
  LifeBuoy,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Home,
  ListTodo,
  Loader,
  CheckSquare,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useUserStore } from '@/stores/useUserStore'
import { useQuery } from '@tanstack/react-query'
import { TaskService } from '@/services/Client/TaskService'
import { TaskResponse, TaskState } from '@/lib/types'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: SquareTerminal,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

const NavbarContent: React.FC = () => {
  const location = useLocation()
  const { token } = useUserStore()
  const [openSections, setOpenSections] = useState<string[]>(['upcoming'])
  const sectionsRef = useRef<HTMLDivElement>(null)

  const fetchTasks = async () => {
    const response = await TaskService.getTasks()
    return response.data
  }

  const { data: tasksData } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    enabled: !!token,
  })

  const sortedTasks = useMemo(() => {
    if (!tasksData) return []
    return [...tasksData].sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }).slice(0, 4) // Only show top 4 tasks
  }, [tasksData])

  const tasksByState = useMemo(() => {
    if (!tasksData) return {}
    return tasksData.reduce((acc, task) => {
      if (!acc[task.state]) {
        acc[task.state] = []
      }
      acc[task.state].push(task)
      return acc
    }, {} as Record<TaskState, TaskResponse[]>)
  }, [tasksData])

  const getTaskIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return AlertCircle
      case 'medium':
        return Clock
      default:
        return CheckCircle2
    }
  }

  const getStateIcon = (state: TaskState) => {
    switch (state) {
      case 'to_do':
        return ListTodo
      case 'in_progress':
        return Loader
      case 'done':
        return CheckSquare
      default:
        return CheckCircle2
    }
  }

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatState = (state: TaskState) => {
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

  const renderTaskList = (tasks: TaskResponse[], showStateIcon = false) => (
    <SidebarMenu>
      {tasks.map((task, index) => {
        const TaskIcon = showStateIcon ? getStateIcon(task.state as TaskState) : getTaskIcon(task.priority)
        return (
          <SidebarMenuItem key={task.id} className="px-2">
            <SidebarMenuButton
              asChild
              className={`py-2 w-full ${!showStateIcon && index === 0 ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}`}
            >
              <Link to={`/tasks/${task.id}`} className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <TaskIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${!showStateIcon && index === 0 ? "text-primary" : ""}`} />
                  <span className={`truncate text-base ${!showStateIcon && index === 0 ? "font-semibold" : ""}`}>{task.title}</span>
                </div>
                <div className="flex items-center ml-2 flex-shrink-0">
                  <Badge variant={!showStateIcon && index === 0 ? "default" : "secondary"} className="mr-2 text-sm">
                    {task.priority}
                  </Badge>
                  {task.deadline && (
                    <span className="text-sm text-muted-foreground">{formatDueDate(task.deadline)}</span>
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      if (sectionsRef.current) {
        const sections = sectionsRef.current.children
        const visibleSections = []
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i] as HTMLElement
          const rect = section.getBoundingClientRect()
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            visibleSections.push(section.dataset.section)
          }
          if (visibleSections.length === 3) break
        }
        setOpenSections(visibleSections)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <SidebarContent className="py-4 bg-background flex flex-col h-full text-base">
      <SidebarGroup className="mb-4 flex-shrink-0">
        <SidebarGroupLabel className="px-4 mb-2 text-lg font-handwritten">Platform</SidebarGroupLabel>
        <SidebarMenu>
          {data.navMain
            .filter(item => !!token || item.title !== "Tasks")
            .map((item) => {
              const isActive = location.pathname === item.url
              return (
                <SidebarMenuItem key={item.title} className="px-2">
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    isActive={isActive}
                    className={`py-2 w-full text-lg ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}`}
                  >
                    <Link to={item.url} className="flex items-center transition-colors duration-300">
                      <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroup>

      {token && (
        <ScrollArea className="flex-grow px-4" style={{ '--scrollbar-color': '#D79B00' } as React.CSSProperties}>
          <div ref={sectionsRef} className="space-y-2">
            <Collapsible
              open={openSections.includes('upcoming')}
              onOpenChange={() => toggleSection('upcoming')}
              data-section="upcoming"
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="mb-1 text-lg font-handwritten flex items-center cursor-pointer">
                  {openSections.includes('upcoming') ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                  Upcoming Tasks
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {renderTaskList(sortedTasks)}
              </CollapsibleContent>
            </Collapsible>

            {Object.entries(tasksByState).map(([state, tasks]) => (
              <Collapsible
                key={state}
                open={openSections.includes(state)}
                onOpenChange={() => toggleSection(state)}
                data-section={state}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="mb-1 text-lg font-handwritten flex items-center cursor-pointer">
                    {openSections.includes(state) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                    {formatState(state as TaskState)}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {renderTaskList(tasks, true)}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      )}

      <SidebarGroup className="mt-auto flex-shrink-0">
        <SidebarMenu>
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title} className="px-2">
              <SidebarMenuButton asChild size="sm" className="py-2 w-full text-base hover:bg-accent hover:text-accent-foreground">
                <a href={item.url} className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}

export default NavbarContent