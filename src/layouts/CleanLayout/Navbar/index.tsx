import React from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import NavbarHeader from './components/NavbarHeader'
import NavbarContent from './components/NavbarContent'
import NavbarFooter from './components/NavbarFooter'
import { useUserStore } from "@/stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/Client/UserService";


const Navbar: React.FC = () => {
  const { token, givenName, familyName, logout: zustandLogout, email } = useUserStore();


  return (
    <Sidebar variant="inset">
      <NavbarHeader />
      <NavbarContent />
      <NavbarFooter token={token} givenName={givenName} familyName={familyName} email={email} />
    </Sidebar>
  )
}

export default Navbar