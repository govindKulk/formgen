"use client";

import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useDraggable } from '@dnd-kit/core';
import { FormComponentType } from '@/store/form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/Logo.svg";
import { Input } from './ui/input';
import { GripVertical } from 'lucide-react';

// A list of the component types you want to offer
const componentTypes: FormComponentType[] = ["Input", "Textarea", "Button", "Checkbox", "Select", "Switch", "Label"];

// Reusable component for each draggable item in the sidebar
function SidebarItem({ type }: { type: FormComponentType }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-item-${type}`,
        // Pass the component type in the data object so we know what to create on drop
        data: { type },
    });

    return (
        <Button
            ref={setNodeRef}
            variant="outline"
            className={`w-full flex items-center gap-2 p-3 bg-gray-50 border rounded-lg dark:bg-gray-800 h-auto cursor-grab transition-all ${isDragging ? 'opacity-30 ring-2 ring-primary' : 'hover:shadow-md'}`}
            {...listeners}
            {...attributes}
        >
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col gap-1 items-start flex-1">
                <span className="text-sm font-medium">{type}</span>
                <div className="w-full">
                    {type === "Input" && <Input  
                    className="border border-neutral-500 h-8"
                    placeholder="Type here..." />}
                    {type === "Textarea" && <textarea  
                    className="border border-neutral-500 rounded px-2 py-1 w-full resize-none text-xs"
                    placeholder="Type here..."
                    rows={2} />}
                    {type === "Button" && <Button 
                    size="sm" 
                    className="pointer-events-none h-7 text-xs">
                    Click me
                    </Button>}
                    {type === "Checkbox" && <div className="flex items-center gap-2">
                    <input type="checkbox" className="pointer-events-none" />
                    <span className="text-xs">Checkbox</span>
                    </div>}
                    {type === "Select" && <select 
                    className="border border-neutral-500 rounded px-2 py-1 w-full pointer-events-none text-xs h-8">
                    <option>Select option</option>
                    </select>}
                    {type === "Switch" && <div className="flex items-center gap-2">
                    <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                    <span className="text-xs">Switch</span>
                    </div>}
                    {type === "Label" && <label className="text-xs font-medium">Label text</label>}
                    {type === "Dialog" && <div className="border border-neutral-500 rounded px-2 py-1 w-full text-xs text-center h-7 flex items-center justify-center">
                    Dialog
                    </div>}
                    {type === "Tooltip" && <div className="border border-neutral-500 rounded px-2 py-1 w-full text-xs text-center h-7 flex items-center justify-center">
                    Tooltip
                    </div>}
                </div>
            </div>
        </Button>
    );
}

function FormCreateSidebar() {
  return (
   <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/">
          <Image src={Logo} alt="Logo" className="w-24 h-auto" />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
            <SidebarGroupLabel className='text-lg font-semibold mb-2'>
                Form Elements
            </SidebarGroupLabel>
            
            <div className="grid grid-cols-1 gap-4">
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
