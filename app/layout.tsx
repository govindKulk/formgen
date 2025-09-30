import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "@/components/theme-provider";

import {
  ClerkProvider} from '@clerk/nextjs'

import Navbar from "@/components/Navbar";
import { AuthStateHandler } from "@/components/auth-state-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "formGen - Create multi-step forms with clicks.",
  description: "A simple and intuitive way to create multi-step forms for your applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk"
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          
            <AuthStateHandler />
            <Navbar/>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(8px)',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid hsl(142 76% 36%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                  },
                  iconTheme: {
                    primary: 'hsl(142 76% 36%)',
                    secondary: 'var(--background)',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid hsl(0 84% 60%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                  },
                  iconTheme: {
                    primary: 'hsl(0 84% 60%)',
                    secondary: 'var(--background)',
                  },
                },
              }}
            />
        </body>
      </html>
    </ClerkProvider>

  </ThemeProvider>
  )
}
