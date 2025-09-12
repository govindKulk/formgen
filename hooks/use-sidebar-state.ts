"use client";

import { useState, useCallback } from 'react';
import { useFormStore } from '@/store/form';

export interface SidebarState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  closeAllSidebars: () => void;
  autoShowRightSidebar: () => void;
}

export function useSidebarState(): SidebarState {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { activeComponentId } = useFormStore();

  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarOpen(prev => !prev);
    // Close right sidebar when opening left
    if (!leftSidebarOpen) {
      setRightSidebarOpen(false);
    }
  }, [leftSidebarOpen]);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen(prev => !prev);
    // Close left sidebar when opening right
    if (!rightSidebarOpen) {
      setLeftSidebarOpen(false);
    }
  }, [rightSidebarOpen]);

  const closeAllSidebars = useCallback(() => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  }, []);

  // Auto-show properties panel when component is selected (for mobile/tablet)
  const autoShowRightSidebar = useCallback(() => {
    if (activeComponentId && !rightSidebarOpen) {
      setRightSidebarOpen(true);
      setLeftSidebarOpen(false);
    }
  }, [activeComponentId, rightSidebarOpen]);

  return {
    leftSidebarOpen,
    rightSidebarOpen,
    setLeftSidebarOpen,
    setRightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    closeAllSidebars,
    autoShowRightSidebar,
  };
}
