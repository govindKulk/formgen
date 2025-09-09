import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { ThemeToggle } from './theme-toggle';


export default function Navbar() {
    return (
        <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link
                            href={"/"}
                        >
                            <Image
                                src="/Logo.svg"
                                alt="FormGen Logo"
                                width={120}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-muted-foreground hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                                About
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        <SignedOut>
                            <SignInButton>
                                <Button
                                    variant="outline"
                                    className="border-green-600 text-green-600 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-green-50 dark:hover:bg-green-950 transition-all cursor-pointer duration-200 hover:scale-105"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-all duration-200 hover:scale-105">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Button
                                asChild
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                <Link href="/forms">
                                    Dashboard
                                </Link>
                            </Button>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    )
}