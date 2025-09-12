"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/use-media-query';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { useClickOutside } from '@/hooks/use-click-outside';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Menu, Settings } from 'lucide-react';
import { useFormStore } from '@/store/form';

interface ResponsiveLayoutProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export function ResponsiveLayout({
  leftSidebar,
  canvas,
  rightSidebar,
}: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const { activeComponentId } = useFormStore();
  
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    closeAllSidebars,
    autoShowRightSidebar,
  } = useSidebarState();

  // Auto-show properties panel when component is selected on mobile/tablet
  useEffect(() => {
    if ((isMobile || isTablet) && activeComponentId) {
      autoShowRightSidebar();
    }
  }, [activeComponentId, isMobile, isTablet, autoShowRightSidebar]);

  const leftSidebarRef = useClickOutside<HTMLDivElement>(() => {
    if (leftSidebarOpen) closeAllSidebars();
  }, leftSidebarOpen);

  const rightSidebarRef = useClickOutside<HTMLDivElement>(() => {
    if (rightSidebarOpen) closeAllSidebars();
  }, rightSidebarOpen);

  // Desktop layout (original 3-column layout)
  if (isDesktop) {
    return (
      <div className="flex gap-4 w-full p-4 h-full justify-between">
        {leftSidebar}
        {canvas}
        {rightSidebar}
      </div>
    );
  }

  // Tablet layout (canvas + right sidebar + floating left button)
  if (isTablet) {
    return (
      <div className="relative flex w-full h-full">
        {/* Canvas and right sidebar */}
        <div className="flex flex-1 gap-4 p-4">
          <div className="flex-1">{canvas}</div>
          <div className="w-80">{rightSidebar}</div>
        </div>

        {/* Floating button for left sidebar */}
        <FloatingActionButton
          onClick={toggleLeftSidebar}
          icon={<Menu className="h-5 w-5" />}
          position="top-left"
          aria-label="Toggle components sidebar"
        />

        {/* Left sidebar overlay */}
        <AnimatePresence>
          {leftSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeAllSidebars}
              />
              
              {/* Left sidebar */}
              <motion.div
                ref={leftSidebarRef}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-background border-r border-border shadow-xl"
              >
                {leftSidebar}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile layout (canvas only + 2 floating buttons)
  return (
    <div className="relative flex w-full h-full">
      {/* Canvas only */}
      <div className="flex-1 p-4 max-w-full">{canvas}</div>

      {/* Floating buttons */}
      <FloatingActionButton
        onClick={toggleLeftSidebar}
        icon={<Menu className="h-5 w-5" />}
        position="left"
        aria-label="Toggle components sidebar"
      />
      
      <FloatingActionButton
        onClick={toggleRightSidebar}
        icon={<Settings className="h-5 w-5" />}
        position="right"
        aria-label="Toggle properties panel"
      />

      {/* Left sidebar overlay */}
      <AnimatePresence>
        {leftSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeAllSidebars}
            />
            
            {/* Left sidebar */}
            <motion.div
              ref={leftSidebarRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-background border-r border-border shadow-xl"
            >
              {leftSidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right sidebar overlay */}
      <AnimatePresence>
        {rightSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeAllSidebars}
            />
            
            {/* Right sidebar */}
            <motion.div
              ref={rightSidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 z-50 bg-background border-l border-border shadow-xl"
            >
              {rightSidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
