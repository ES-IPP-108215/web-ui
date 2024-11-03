import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  SquareTerminal,
  Bot,
  LifeBuoy,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Home
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
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
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
  tasks: [
    {
      title: "Finish project proposal",
      priority: "High",
      dueDate: "Today",
      icon: AlertCircle,
    },
    {
      title: "Review team performance",
      priority: "Medium",
      dueDate: "Tomorrow",
      icon: Clock,
    },
    {
      title: "Update client documentation",
      priority: "Low",
      dueDate: "Next week",
      icon: CheckCircle2,
    },
    {
      title: "Prepare for quarterly meeting",
      priority: "Medium",
      dueDate: "Next week",
      icon: Clock,
    },
  ],
}

const NavbarContent: React.FC = () => {
  const location = useLocation()

  return (
    <SidebarContent className="py-6 bg-background">
      <SidebarGroup className="mb-6">
        <SidebarGroupLabel className="px-4 mb-3 text-lg font-handwritten">Platform</SidebarGroupLabel>
        <SidebarMenu>
          {data.navMain.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title} className="px-2">
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  isActive={isActive}
                  className={`py-3 w-full text-lg ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}`}
                >
                  <Link to={item.url} className="flex items-center transition-colors duration-300">
                    <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mb-6">
        <SidebarGroupLabel className="px-4 mb-3 text-lg font-handwritten">Upcoming Tasks</SidebarGroupLabel>
        <SidebarMenu>
          {data.tasks.map((task, index) => (
            <SidebarMenuItem key={task.title} className="px-2">
              <SidebarMenuButton
                asChild
                className={`py-3 w-full ${index === 0 ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}`}
              >
                <a href="#" className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <task.icon className={`mr-4 h-5 w-5 flex-shrink-0 ${index === 0 ? "text-primary" : ""}`} />
                    <span className={`truncate text-base ${index === 0 ? "font-semibold" : ""}`}>{task.title}</span>
                  </div>
                  <Badge variant={index === 0 ? "default" : "secondary"} className="ml-2 flex-shrink-0 text-sm">
                    {task.priority}
                  </Badge>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mt-auto">
        <SidebarMenu>
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title} className="px-2">
              <SidebarMenuButton asChild size="sm" className="py-3 w-full text-base hover:bg-accent hover:text-accent-foreground">
                <a href={item.url} className="flex items-center">
                  <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
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