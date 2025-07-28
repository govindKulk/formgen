import { FormComponent } from '@/store/form'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { GripVertical, Trash2 } from 'lucide-react'
import { useFormStore } from '@/store/form'
import { Button } from './ui/button'
import { useOutsideClick } from '@/hooks/use-outside-click'
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

    const { removeComponent, activeComponentId, setActiveComponentId } = useFormStore();
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

    // Hook to detect clicks outside this component
    const outsideClickRef = useOutsideClick<HTMLDivElement>(() => {
        // Only deactivate if this component is currently active
        if (activeComponentId === formComponentProps.id) {
            setActiveComponentId(undefined);
        }
    }, ['[data-properties-panel]']); // Exclude properties panel

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeComponent(formComponentProps.id);
    };

    const handleComponentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Set this component as active when clicked
        setActiveComponentId(formComponentProps.id);
    };

    // Combine all refs (drag, drop, and outside click detection)
    const setRefs = (element: HTMLDivElement | null) => {
        setDragRef(element);
        setDropRef(element);
        outsideClickRef.current = element;
    };

    return (
        <div
            ref={setRefs}
            style={style}
            onClick={handleComponentClick}
            className={`group relative py-2 px-2 rounded-lg bg-background transition-all cursor-pointer ${
                isDragging ? 'opacity-50 ring-2 ring-primary shadow-lg z-50' : 
                isOver ? 'border-primary border-2 bg-primary/5' : ''
            } ${activeComponentId === formComponentProps.id ? 'shadow-[0_0_0_2px_rgba(0,0,255,0.5),_0_-1px_0_1px_rgba(0,0,255,0.5)]' : 'shadow-none'}`}
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
            {formComponentProps.showLabel && <div className="text-xs text-muted-foreground mb-2">
                {formComponentProps.props?.label || `${formComponentProps.type} Component ${index}`}
            </div>}
            
            {/* Component content */}
            <div className={`${formComponentProps.showLabel ? 'mt-2' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default Draggable