import { FormComponent } from '@/store/form'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { GripVertical, Trash2 } from 'lucide-react'
import { useFormStore } from '@/store/form'
import { Button } from './ui/button'
import React from 'react'

function Draggable({
    children,
    formComponentProps,
    index
}: {
    children: React.ReactNode,
    formComponentProps: FormComponent,
    index: number
}) {

    const { removeComponent } = useFormStore();
    const { setNodeRef: setDragRef, listeners, attributes, isDragging, transform } = useDraggable({
        id: formComponentProps.id,
        data: { 
            type: 'canvas-item',
            formComponent: formComponentProps,
            index 
        }
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `droppable-${formComponentProps.id}`,
        data: {
            type: 'canvas-item',
            formComponent: formComponentProps,
            index
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeComponent(formComponentProps.id);
    };

    // Combine both refs
    const setRefs = (element: HTMLDivElement | null) => {
        setDragRef(element);
        setDropRef(element);
    };

    return (
        <div
            ref={setRefs}
            style={style}
            className={`group relative p-4 border rounded-lg bg-background transition-all ${
                isDragging ? 'opacity-50 ring-2 ring-primary shadow-lg z-50' : 
                isOver ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary hover:shadow-md'
            }`}
        >
            {/* Drag handle and controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
                <div
                    {...listeners}
                    {...attributes}
                    className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Component label */}
            <div className="text-xs text-muted-foreground mb-2">
                {formComponentProps.props?.label || `${formComponentProps.type} Component`}
            </div>
            
            {/* Component content */}
            <div className="mt-2">
                {children}
            </div>
        </div>
    )
}

export default Draggable