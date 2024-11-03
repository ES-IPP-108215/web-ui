import React from 'react'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  UserPlus,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Link } from 'react-router-dom'

interface NavbarFooterProps {
  token: string;
  givenName: string;
  familyName: string;
  email: string;
  onLogout: () => void;
}

const NavbarFooter: React.FC<NavbarFooterProps> = ({ token, givenName, familyName, email, onLogout }) => {
  return (
    <SidebarFooter className="p-4 bg-background">
      <SidebarMenu>
        <SidebarMenuItem>
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage
                      src="https://avatars.dicebear.com/api/avataaars/john-doe.svg"
                      alt={givenName + ' ' + familyName}
                    />
                    <AvatarFallback className="rounded-lg text-lg">
                      {givenName[0] + familyName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight ml-3">
                    <span className="truncate font-semibold text-base">
                      {givenName + ' ' + familyName}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-2 py-2 text-left">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage
                        src="https://avatars.dicebear.com/api/avataaars/john-doe.svg"
                        alt={givenName + ' ' + familyName}
                      />
                      <AvatarFallback className="rounded-lg text-lg">
                        {givenName[0] + familyName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-semibold text-base">
                        {givenName + ' ' + familyName}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-3 h-5 w-5" />
                    <span className="text-base">Upgrade to Pro</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-3 h-5 w-5" />
                    <span className="text-base">Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-3 h-5 w-5" />
                    <span className="text-base">Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-3 h-5 w-5" />
                    <span className="text-base">Notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-3 h-5 w-5" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start -translate-x-2 text-base"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={import.meta.env.VITE_LOGIN_SIGN_UP}>
              <Button
                variant="outline"
                className="w-full justify-start text-base py-3"
              >
                <UserPlus className="mr-3 h-5 w-5" />
                Register / Login
              </Button>
            </Link>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

export default NavbarFooter