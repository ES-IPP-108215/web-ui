import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Navbar from './Navbar'

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john-doe.jpg",
}

const CleanLayout: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsLoggedIn(true)
    setUser(mockUser)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  return (
    <SidebarProvider>
      <Navbar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <p>
                In Progress
              </p>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { CleanLayout }