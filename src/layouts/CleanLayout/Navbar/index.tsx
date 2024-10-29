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

  const logout = async () => {
    const response = await UserService.logout();
    return response.data;
  }

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      zustandLogout();
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  return (
    <Sidebar variant="inset">
      <NavbarHeader />
      <NavbarContent />
      <NavbarFooter token={token} givenName={givenName} familyName={familyName} email={email} onLogout={handleLogout} />
    </Sidebar>
  )
}

export default Navbar