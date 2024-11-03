import React from 'react'
import { Command } from "lucide-react"
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ModeToggle } from '@/components/mode-toggle'
import todo_list_transparent from '@/assets/todo_list_transparent.png'
import { useTheme } from '@/components/theme-provider'

const NavbarHeader: React.FC = () => {
    const { theme } = useTheme()

  return (
    <SidebarHeader className="bg-background">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center w-full">
          <SidebarMenuButton size="lg" asChild>
            <div>
               <a href="/" className='flex items-center w-full space-x-2'>
                <div className="flex aspect-square items-center justify-center rounded-lg">
                <img src={todo_list_transparent} alt="logo" className="w-16 h-16" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-2xl font-handwritten font-semibold">Todo List</span>
                <span className="text-sm font-handwritten text-muted-foreground">By Kernaite</span>
                </div>
               </a>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export default NavbarHeader