"use client"

import FormCanvas from '@/components/form-canvas'
import FormCreateSidebar from '@/components/form-create-sidebar'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import {DndContext, DragEndEvent, DragOverlay, closestCenter, DragStartEvent, Active} from '@dnd-kit/core'
import { useFormStore, FormComponentType } from '@/store/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical } from 'lucide-react'
import PropertiesPanel from '@/components/properties-panel'

function CreateFormPage() {
    const {addComponent, components, moveComponent} = useFormStore();
    const [activeItem, setActiveItem] = useState<Active | null>(null);
    
    const handleDragStart = (event: DragStartEvent) => {
        setActiveItem(event.active);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveItem(null);
        if (!over) {
            return;
        };
        
        const activeData = active.data.current;
        const overData = over.data.current;

        
        // Handle dropping new component from sidebar to canvas
        if (activeData?.type && typeof activeData.type === 'string' && activeData.type != "canvas-item" && over.id === 'form-canvas') {
            console.log("sidebar to canvas");
            const componentCount = components.length;
            addComponent(componentCount, activeData.type as FormComponentType);
            return;
        }
        
        // Handle dropping new component from sidebar to drop zone
        if (activeData?.type && typeof activeData.type === 'string' && activeData.type != "canvas-item" && overData?.type === 'drop-zone') {
            console.log("sidebar to drop zone");
            addComponent(overData.index, activeData.type as FormComponentType);
            return;
        }
        
        // Handle reordering components within the canvas
        if (activeData?.type === 'canvas-item' && overData?.type === 'canvas-item') {
            console.log("canvas to canvas");
            const activeIndex = activeData.index;
            const overIndex = overData.index;
            
            if (activeIndex !== overIndex) {
                moveComponent(activeIndex, overIndex);
            }
            return;
        }
        
        // Handle dropping canvas item on drop zone
        if (activeData?.type === 'canvas-item' && overData?.type === 'drop-zone') {
            console.log("canvas to drop  zone");
            const activeIndex = activeData.index;
            const newIndex = overData.index > activeIndex ? overData.index - 1 : overData.index;
            
            if (activeIndex !== newIndex) {
                moveComponent(activeIndex, newIndex);
            }
            return;
        }
    }

    // Render the drag overlay
    const renderDragOverlay = () => {
        if (!activeItem) return null;

        const activeData = activeItem.data.current;

        // If dragging from sidebar
        if (activeData?.type && typeof activeData.type === 'string') {
            return (
                <div className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-lg opacity-95 pointer-events-none">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{activeData.type}</span>
                        <div className="w-full">
                            {activeData.type === "Input" && <Input className="h-6 text-xs pointer-events-none" placeholder="Type here..." />}
                            {activeData.type === "Button" && <Button size="sm" className="h-6 text-xs pointer-events-none">Click me</Button>}
                            {activeData.type === "Textarea" && <div className="border rounded p-1 text-xs w-32 h-6 flex items-center">Textarea</div>}
                            {activeData.type === "Checkbox" && <div className="flex items-center gap-1"><input type="checkbox" className="pointer-events-none" /><span className="text-xs">Checkbox</span></div>}
                            {activeData.type === "Select" && <select className="border rounded px-1 text-xs h-6 w-24 pointer-events-none"><option>Select</option></select>}
                            {activeData.type === "Switch" && <div className="flex items-center gap-1"><div className="w-6 h-3 bg-gray-300 rounded-full"><div className="w-2 h-2 bg-white rounded-full mt-0.5 ml-0.5"></div></div><span className="text-xs">Switch</span></div>}
                            {activeData.type === "Label" && <label className="text-xs font-medium">Label text</label>}
                            {activeData.type === "Dialog" && <div className="border rounded px-2 py-1 text-xs">Dialog</div>}
                            {activeData.type === "Tooltip" && <div className="border rounded px-2 py-1 text-xs">Tooltip</div>}
                        </div>
                    </div>
                </div>
            );
        }

        // If dragging canvas item - make it smaller and without tilt
        if (activeData?.type === 'canvas-item') {
            const component = activeData.formComponent;
            return (
                <div className="p-3 bg-white border rounded-lg shadow-lg opacity-95 min-w-[150px] max-w-[200px] pointer-events-none">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                        <div>
                            <div className="text-xs font-medium">{component.type}</div>
                            <div className="text-xs text-muted-foreground truncate">
                                {component.props?.label || `${component.type} Component`}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };
    return (
        <SidebarProvider>
            {/* Form components sidebar */}
            <DndContext 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
            >
                <div
                className='flex gap-4 w-full p-4'
                >
                    <FormCreateSidebar/>
                    <FormCanvas/>
                    <PropertiesPanel/>
                </div>
                <DragOverlay>
                    {renderDragOverlay()}
                </DragOverlay>
            </DndContext>
        </SidebarProvider>
    )
}``

export default CreateFormPage