"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  position: 'left' | 'right' | 'top-left';
  className?: string;
  'aria-label'?: string;
}

export function FloatingActionButton({
  onClick,
  icon,
  position,
  className,
  'aria-label': ariaLabel,
}: FloatingActionButtonProps) {
  const positionClasses = {
    left: 'left-4 bottom-10',
    right: 'right-4 bottom-10',
    'top-left': 'left-4 top-20',
  };

  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        'fixed z-50 h-12 w-12 rounded-full shadow-lg',
        'bg-primary/50 text-primary-foreground',
        'hover:bg-primary/90 hover:shadow-xl',
        'transition-all duration-200 ease-in-out',
        'border border-border/20',
        positionClasses[position],
        className
      )}
      aria-label={ariaLabel}
    >
      {icon}
    </Button>
  );
}
