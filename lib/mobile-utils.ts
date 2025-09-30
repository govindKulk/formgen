"use client";

/**
 * Mobile touch utilities for better drag and drop UX
 */

export const mobileUtils = {
  // Provide haptic feedback on mobile devices
  vibrate: (duration: number = 50) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  },

  // Check if device supports touch
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Prevent default touch behaviors that interfere with drag
  preventTouchInterference: (element: HTMLElement) => {
    if (!element) return;
    
    element.style.touchAction = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.userSelect = 'none';
    
    // Prevent context menu on long press
    element.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Prevent text selection
    element.addEventListener('selectstart', (e) => e.preventDefault());
  },

  // Add visual feedback for drag start
  addDragStartFeedback: (element: HTMLElement) => {
    if (!element) return;
    
    element.classList.add('dnd-dragging');
    element.style.transform = 'scale(1.05) rotate(2deg)';
    element.style.zIndex = '1000';
    
    // Add vibration feedback on mobile
    mobileUtils.vibrate(30);
  },

  // Remove visual feedback for drag end
  removeDragEndFeedback: (element: HTMLElement) => {
    if (!element) return;
    
    element.classList.remove('dnd-dragging');
    element.style.transform = '';
    element.style.zIndex = '';
  }
};

export default mobileUtils;