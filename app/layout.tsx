import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "@/components/theme-provider";

import {
  ClerkProvider} from '@clerk/nextjs'

import Navbar from "@/components/Navbar";
import { AuthStateHandler } from "@/components/auth-state-handler";
import StructuredData from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "formGen - Create multi-step forms with clicks",
  description: "Build beautiful, responsive multi-step forms with our drag-and-drop builder. Custom branding, real-time analytics, and mobile optimization included.",
  keywords: ["form builder", "multi-step forms", "drag and drop", "form creator", "survey builder", "custom forms", "analytics"],
  authors: [{ name: "Govind Kulkarni" }],
  creator: "formGen",
  publisher: "formGen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // OpenGraph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://formgene.vercel.app",
    siteName: "formGen",
    title: "formGen - Create multi-step forms with clicks",
    description: "Build beautiful, responsive multi-step forms with our drag-and-drop builder. Custom branding, real-time analytics, and mobile optimization included.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "formGen - Drag & Drop Form Builder",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@GovindK02338279", // Add your Twitter handle
    creator: "@GovindK02338279", // Add your personal Twitter handle
    title: "formGen - Create multi-step forms with clicks",
    description: "Build beautiful, responsive multi-step forms with our drag-and-drop builder. Custom branding, real-time analytics, and mobile optimization included.",
    images: ["/og-image.png"],
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Viewport and mobile optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  
  // App-specific metadata
  applicationName: "formGen",
  referrer: "origin-when-cross-origin",
  category: "productivity",
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  
  // Manifest for PWA
  manifest: "/site.webmanifest",
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
            <StructuredData />
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
