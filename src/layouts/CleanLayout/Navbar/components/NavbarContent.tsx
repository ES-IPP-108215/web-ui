import React from 'react'
import {
  SquareTerminal,
  Bot,
  LifeBuoy,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar
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
      title: "Tasks",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
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
  return (
    <SidebarContent className="py-4">
      <SidebarGroup className="mb-4">
        <SidebarGroupLabel className="px-4 mb-2">Platform</SidebarGroupLabel>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title} className="px-2">
              <SidebarMenuButton 
                asChild 
                tooltip={item.title} 
                isActive={item.isActive}
                className="py-2 w-full"
              >
                <a href={item.url} className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mb-4">
        <SidebarGroupLabel className="px-4 mb-2">Upcoming Tasks</SidebarGroupLabel>
        <SidebarMenu>
          {data.tasks.map((task, index) => (
            <SidebarMenuItem key={task.title} className="px-2">
              <SidebarMenuButton
                asChild
                className={`py-2 w-full ${index === 0 ? "bg-primary/10 hover:bg-primary/20" : ""}`}
              >
                <a href="#" className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <task.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${index === 0 ? "text-primary" : ""}`} />
                    <span className={`truncate ${index === 0 ? "font-semibold" : ""}`}>{task.title}</span>
                  </div>
                  <Badge variant={index === 0 ? "default" : "secondary"} className="ml-2 flex-shrink-0">
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
              <SidebarMenuButton asChild size="sm" className="py-2 w-full">
                <a href={item.url} className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
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