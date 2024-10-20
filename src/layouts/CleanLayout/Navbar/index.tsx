import React from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import NavbarHeader from './components/NavbarHeader'
import NavbarContent from './components/NavbarContent'
import NavbarFooter from './components/NavbarFooter'

interface NavbarProps {
  isLoggedIn: boolean
  user: { name: string; email: string; avatar: string } | null
  onLogin: () => void
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onLogin, onLogout }) => {
  return (
    <Sidebar variant="inset">
      <NavbarHeader />
      <NavbarContent />
      <NavbarFooter 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </Sidebar>
  )
}

export default Navbar