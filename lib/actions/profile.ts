"use server"

import { auth, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema for profile updates
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).optional(),
})

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ProfileUpdateResult = {
  success: boolean
  error?: string
  message?: string
}

export async function updateProfile(formData: FormData): Promise<ProfileUpdateResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string || undefined,
    }

    const validatedData = profileUpdateSchema.parse(data)
    const client = await clerkClient()

    await client.users.updateUser(userId, {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      ...(validatedData.username && { username: validatedData.username }),
    })

    revalidatePath('/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function updateEmail(formData: FormData): Promise<ProfileUpdateResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const email = formData.get('email') as string
    if (!email || !z.string().email().safeParse(email).success) {
      return { success: false, error: 'Valid email is required' }
    }

    const client = await clerkClient()
    
    // Create new email address for verification
    await client.emailAddresses.createEmailAddress({
      userId,
      emailAddress: email,
    })

    revalidatePath('/profile')
    return { success: true, message: 'Email update initiated. Please check your new email for verification.' }
  } catch (error) {
    console.error('Email update error:', error)
    return { success: false, error: 'Failed to update email' }
  }
}

export async function updatePassword(formData: FormData): Promise<ProfileUpdateResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validatedData = passwordUpdateSchema.parse(data)
    const client = await clerkClient()

    // Update password in Clerk
    await client.users.updateUser(userId, {
      password: validatedData.newPassword,
    })

    revalidatePath('/profile')
    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error('Password update error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to update password' }
  }
}

export async function deleteAccount(): Promise<ProfileUpdateResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return { success: true, message: 'Account deleted successfully' }
  } catch (error) {
    console.error('Account deletion error:', error)
    return { success: false, error: 'Failed to delete account' }
  }
}