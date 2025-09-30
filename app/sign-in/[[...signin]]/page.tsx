"use client"
import { SignIn } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

function SignInPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Force a hard refresh to ensure all client state is updated
      router.push('/forms')
      router.refresh()
    }
  }, [isSignedIn, isLoaded, router])
  return (
    <div className='flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-green-50/30 via-background to-green-50/30 dark:from-green-950/10 dark:via-background dark:to-green-950/10'>
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 dark:bg-green-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-200/15 dark:bg-purple-400/8 rounded-full animate-float" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-card/95 backdrop-blur-md border border-border/50  rounded-xl p-8 relative overflow-hidden',
              cardBox: 'shadow-none',
              headerTitle: 'text-2xl font-bold text-foreground mb-2',
              headerSubtitle: 'text-muted-foreground font-medium mb-6',
              socialButtonsBlockButton: 'bg-background/80 backdrop-blur-sm border border-border/60 text-foreground hover:bg-muted/80 transition-all duration-200 font-medium rounded-lg h-12 flex items-center justify-center gap-3',
              socialButtonsBlockButtonText: 'font-medium text-foreground',
              socialButtonsProviderIcon: 'w-5 h-5',
              dividerLine: 'bg-border/60',
              dividerText: 'text-muted-foreground font-medium uppercase tracking-wide text-xs',
              formFieldInput: 'bg-background/80 backdrop-blur-sm border border-border/60 text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 rounded-lg h-12 px-4',
              formFieldLabel: 'text-foreground font-medium mb-2 text-sm',
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-200 rounded-lg h-12 shadow-md hover:shadow-lg',
              footerActionLink: 'text-primary hover:text-primary/80 font-medium transition-colors duration-200',
              footerActionText: 'text-muted-foreground',
              identityPreviewText: 'text-foreground',
              identityPreviewEditButton: 'text-primary hover:text-primary/80',
              formResendCodeLink: 'text-primary hover:text-primary/80 font-medium',
              alert: 'bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mb-4',
              alertText: 'text-destructive font-medium',
              formFieldWarningText: 'text-destructive font-medium text-sm',
              formFieldSuccessText: 'text-green-600 dark:text-green-400 font-medium text-sm',
              formFieldHintText: 'text-muted-foreground text-sm',
              otpCodeFieldInput: 'bg-background/80 border border-border/60 text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 rounded-lg h-12 text-center font-mono',
              formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground transition-colors duration-200 p-2',
              main: 'space-y-6',
              footer: 'space-y-4 mt-6',
              header: 'text-center mb-8',
              form: 'space-y-5',
            },
            layout: {
              socialButtonsPlacement: 'bottom',
              showOptionalFields: true,
              socialButtonsVariant: 'blockButton',
            },
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--card))',
              colorInputBackground: 'hsl(var(--background))',
              colorInputText: 'hsl(var(--foreground))',
              colorText: 'hsl(var(--foreground))',
              colorTextSecondary: 'hsl(var(--muted-foreground))',
              colorDanger: 'hsl(var(--destructive))',
              colorSuccess: 'hsl(var(--primary))',
              colorWarning: 'hsl(24 100% 50%)',
              colorNeutral: 'hsl(var(--muted))',
              fontFamily: 'var(--font-geist-sans)',
              fontFamilyButtons: 'var(--font-geist-sans)',
              fontSize: '14px',
              borderRadius: '8px',
              spacingUnit: '1rem',
            }
          }}
          afterSignInUrl="/forms"
          afterSignUpUrl="/forms"
          redirectUrl="/forms"
          signUpUrl="/sign-up"
          
        />
      </div>
    </div>
  )
}

export default SignInPage