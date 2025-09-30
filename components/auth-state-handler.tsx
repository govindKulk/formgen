"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function AuthStateHandler() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only trigger refresh when user state actually changes
    if (isLoaded) {
      const currentUserId = user?.id || null;
      
      // If user state has changed (login/logout)
      if (previousUserIdRef.current !== currentUserId) {
        previousUserIdRef.current = currentUserId;
        
        // Only refresh if we're on a page that needs auth state
        if (pathname.startsWith('/forms') || pathname.startsWith('/analytics') || pathname === '/') {
          router.refresh();
        }
      }
    }
  }, [isLoaded, user?.id, router, pathname]);

  return null; // This component doesn't render anything
}