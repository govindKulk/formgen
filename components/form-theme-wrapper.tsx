"use client";

import React from 'react';

interface FormThemeWrapperProps {
  children: React.ReactNode;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    brandLogo?: string;
    showPoweredBy?: boolean;
  };
}

export function FormThemeWrapper({ children, theme }: FormThemeWrapperProps) {
  return (
    <div 
      className="form-theme-wrapper"
      style={{
        '--form-primary': theme?.primaryColor || '#3b82f6',
        '--form-background': theme?.backgroundColor || '#ffffff',
        '--form-text': theme?.textColor || '#000000',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
