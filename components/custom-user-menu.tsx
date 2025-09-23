"use client"

import React, { useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  Shield,
  HelpCircle,
  FileText
} from 'lucide-react'
import { ProfileModalV2 } from './enhanced-profile-modal'
import { ProfileModal } from './profile-modal'

export function CustomUserMenu() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  if (!user) return null

  const userInitials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()

  return (
    <>
      <DropdownMenu
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage 
                src={user.imageUrl} 
                alt={user.fullName || 'User'} 
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.fullName || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsProfileModalOpen(true)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4 text-primary" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => router.push('/forms')}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w- text-primary" />
            <span>My Forms</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-primary" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4 text-primary" />
            <span>Security</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4 text-primary" />
            <span>Billing</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4 text-primary" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => signOut({ redirectUrl: '/' })}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4 text-primary" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <ProfileModalV2 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      /> */}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  )
}