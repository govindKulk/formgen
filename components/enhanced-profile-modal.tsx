"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { 
  User, 
  Mail, 
  Calendar,
  Shield,
  FileText,
  BarChart3,
  Eye,
  Users,
  ExternalLink,
  Edit,
  Save,
  X,
  Github,
  Chrome
} from 'lucide-react'
import { updateProfile, type ProfileUpdateResult } from '@/lib/actions/profile'
import { useTransition } from 'react'
import { format } from 'date-fns'

interface ProfileModalV2Props {
  isOpen: boolean
  onClose: () => void
}

interface FormStats {
  id: string
  title: string
  visits: number
  submissions: number
  published: boolean
  createdAt: string
}

export function ProfileModalV2({ isOpen, onClose }: ProfileModalV2Props) {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [forms, setForms] = useState<FormStats[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  })

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
      })
      loadUserForms()
    }
  }, [user, isOpen])

  const loadUserForms = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/forms')
      if (response.ok) {
        const formsData = await response.json()
        setForms(formsData.slice(0, 5)) // Show only recent 5 forms
      }
    } catch (error) {
      console.error('Failed to load forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    const formDataObj = new FormData()
    formDataObj.append('firstName', formData.firstName)
    formDataObj.append('lastName', formData.lastName)
    formDataObj.append('username', formData.username)

    startTransition(async () => {
      const result: ProfileUpdateResult = await updateProfile(formDataObj)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' })
        setIsEditing(false)
        // Refresh user data
        await user?.reload()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    })
  }

  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase()

  const totalVisits = forms.reduce((sum, form) => sum + form.visits, 0)
  const totalSubmissions = forms.reduce((sum, form) => sum + form.submissions, 0)
  const publishedForms = forms.filter(form => form.published).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Manage your profile information and view your form statistics
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/50' 
              : 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="forms">My Forms</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and preferences
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveProfile} 
                        size="sm" 
                        disabled={isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: user?.firstName || '',
                            lastName: user?.lastName || '',
                            username: user?.username || '',
                          })
                        }} 
                        variant="outline" 
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">{user?.firstName || 'Not set'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded-md">{user?.lastName || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="text-sm p-2 bg-muted rounded-md">{user?.username || 'Not set'}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email Address</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
                      <Badge variant={user?.primaryEmailAddress?.verification?.status === 'verified' ? 'default' : 'secondary'}>
                        {user?.primaryEmailAddress?.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-sm p-3 bg-muted rounded-md">
                      {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-2xl font-bold">{forms.length}</p>
                      <p className="text-sm text-muted-foreground">Total Forms</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-2xl font-bold">{totalVisits}</p>
                      <p className="text-sm text-muted-foreground">Total Visits</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-2xl font-bold">{totalSubmissions}</p>
                      <p className="text-sm text-muted-foreground">Total Submissions</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Forms
                  </CardTitle>
                  <CardDescription>
                    Your most recently created forms and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
                      ))}
                    </div>
                  ) : forms.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
                      <p className="text-muted-foreground">Create your first form to see it here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {forms.map((form) => (
                        <div key={form.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{form.title}</h4>
                              <Badge variant={form.published ? 'default' : 'secondary'}>
                                {form.published ? 'Published' : 'Draft'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {form.visits} visits
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {form.submissions} submissions
                              </span>
                              <span>{format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Overview
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and connected accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Connected Accounts</h4>
                    <div className="space-y-3">
                      {user?.externalAccounts?.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            {account.provider === 'google' && <Chrome className="h-5 w-5 text-red-500" />}
                            {account.provider === 'github' && <Github className="h-5 w-5" />}
                            <div>
                              <p className="font-medium capitalize">{account.provider}</p>
                              <p className="text-sm text-muted-foreground">{account.emailAddress}</p>
                            </div>
                          </div>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                      )) || (
                        <p className="text-sm text-muted-foreground">No connected accounts</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Account Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Change Email Address
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}