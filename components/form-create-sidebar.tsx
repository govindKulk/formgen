"use client";

import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useDraggable } from '@dnd-kit/core';
import { FormComponentType, useFormStore } from '@/store/form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/Logo.svg";
import { Input } from './ui/input';
import { GripVertical, Plus } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-media-query';

// A list of the component types you want to offer
const componentTypes: FormComponentType[] = ["Input", "Textarea", "Button", "Checkbox", "Select", "Switch", "Label", "MCQ"];

// Reusable component for each draggable item in the sidebar
function SidebarItem({ type }: { type: FormComponentType }) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const { addComponent, getCurrentStepComponents, setActiveComponentId } = useFormStore();
    
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-item-${type}`,
        // Pass the component type in the data object so we know what to create on drop
        data: { type },
    });

    // Handle adding component directly to the end of the form
    const handleAddComponent = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag initiation
        const currentComponents = getCurrentStepComponents();
        addComponent(currentComponents.length, type);
        
        // Get the newly added component ID to set it as active
        // Since addComponent adds to the end, the new component will be at the last index
        setTimeout(() => {
            const updatedComponents = getCurrentStepComponents();
            const newComponent = updatedComponents[updatedComponents.length - 1];
            if (newComponent) {
                setActiveComponentId(newComponent.id);
            }
        }, 0);
    };

    return (
        <div className="relative group">
            <Button
                ref={setNodeRef}
                variant="outline"
                className={`w-full flex items-center gap-2 p-3 bg-muted border rounded-lg h-auto cursor-grab transition-all ${isDragging ? 'opacity-30 ring-2 ring-primary' : 'hover:shadow-md'} ${
                    isMobile || isTablet ? 'touch-manipulation select-none' : ''
                }`}
                {...listeners}
                {...attributes}
                style={{
                    // Improve touch targets on mobile
                    minHeight: isMobile ? '60px' : '48px',
                    touchAction: 'none', // Improve drag behavior on touch devices
                }}
            >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col gap-1 items-start flex-1">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="w-full flex justify-start">
                        {type === "Input" && <Input  
                        className="border border-neutral-500 h-8"
                        placeholder="Type here..." />}
                        {type === "Textarea" && <textarea  
                        className="border border-neutral-500 rounded px-2 py-1 w-full resize-none text-xs"
                        placeholder="Type here..."
                        rows={2} />}
                        {type === "Button" && <div 
                        className="pointer-events-none h-7 text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center whitespace-nowrap font-medium">
                        Click me
                        </div>}
                        {type === "Checkbox" && <div className="flex items-center gap-2">
                        <input type="checkbox" className="pointer-events-none" />
                        <span className="text-xs">Checkbox</span>
                        </div>}
                        {type === "Select" && <select 
                        className="border border-neutral-500 rounded px-2 py-1 w-full pointer-events-none text-xs h-8">
                        <option>Select option</option>
                        </select>}
                        {type === "Switch" && <div className="flex items-center gap-2">
                        <div className="w-8 h-4 bg-border rounded-full relative">
                            <div className="w-3 h-3 bg-background rounded-full absolute top-0.5 left-0.5"></div>
                        </div>
                        <span className="text-xs">Switch</span>
                        </div>}
                        {type === "Label" && <label className="text-xs font-medium">Label text</label>}
                        {type === "MCQ" && <div className="w-full">
                            <div className="text-xs font-medium mb-1">Question?</div>
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 border border-border rounded-full"></div>
                                    <span className="text-[10px]">Option A</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 border border-border rounded-full"></div>
                                    <span className="text-[10px]">Option B</span>
                                </div>
                            </div>
                        </div>}
                        {type === "Dialog" && <div className="border border-neutral-500 rounded px-2 py-1 w-full text-xs text-center h-7 flex items-center justify-center">
                        Dialog
                        </div>}
                        {type === "Tooltip" && <div className="border border-neutral-500 rounded px-2 py-1 w-full text-xs text-center h-7 flex items-center justify-center">
                        Tooltip
                        </div>}
                    </div>
                </div>
            </Button>
            
            {/* Quick Add Button - Positioned at top-right corner */}
            <Button
                onClick={handleAddComponent}
                size="icon"
                variant="default"
                className={`absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-200 ${
                    isMobile || isTablet 
                        ? 'opacity-100' // Always visible on touch devices
                        : 'opacity-0 group-hover:opacity-100' // Only show on hover for desktop
                } z-10`}
                style={{
                    // Ensure good touch target on mobile
                    minHeight: isMobile ? '32px' : '24px',
                    minWidth: isMobile ? '32px' : '24px',
                }}
                title={`Add ${type} to form`}
                aria-label={`Add ${type} component to form`}
            >
                <Plus className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
            </Button>
        </div>
    );
}

function FormCreateSidebar() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // For mobile/tablet overlay mode, render without Sidebar wrapper
  if (isMobile || isTablet) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className={`border-b border-border ${isMobile || isTablet ? 'p-3' : 'p-4'}`}>
          <Link href="/">
            <Image src={Logo} alt="Logo" className="w-24 h-auto" />
          </Link>
        </div>
        
        {/* Content */}
        <div className={`${isMobile || isTablet ? 'p-3' : 'p-4'} overflow-y-auto flex-1`}>
          <div>
            <h3 className={`font-semibold mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Form Elements
            </h3>
            
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'gap-4'}`}>
              {/* Map over the component types to create a draggable item for each */}
              {componentTypes.map((type) => (
                <SidebarItem key={type} type={type} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For desktop, use the original Sidebar component
  return (
   <Sidebar className="h-full">
      <SidebarHeader className={`border-b ${isMobile || isTablet ? 'p-3' : 'p-4'}`}>
        <Link href="/">
          <Image src={Logo} alt="Logo" className="w-24 h-auto" />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className={`${isMobile || isTablet ? 'p-3' : 'p-4'} overflow-y-auto`}>
        <SidebarGroup>
            <SidebarGroupLabel className={`font-semibold mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Form Elements
            </SidebarGroupLabel>
            
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'gap-4'}`}>
                {/* Map over the component types to create a draggable item for each */}
                {componentTypes.map((type) => (
                    <SidebarItem key={type} type={type} />
                ))}
            </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default FormCreateSidebar;
