import React from 'react'
import { Sidebar } from "@/components/ui/sidebar"
import NavbarHeader from './components/NavbarHeader'
import NavbarContent from './components/NavbarContent'
import NavbarFooter from './components/NavbarFooter'
import { useUserStore } from "@/stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/Client/UserService";
import { useNavigate } from 'react-router-dom'


const Navbar: React.FC = () => {
  const { token, givenName, familyName, logout: zustandLogout, email } = useUserStore();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await UserService.logout();
    return response.data;
  }

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      zustandLogout();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
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