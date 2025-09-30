import { FormComponent } from '@/store/form'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { GripVertical, Trash2 } from 'lucide-react'
import { useFormStore } from '@/store/form'
import { Button } from './ui/button'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { useIsMobile } from '@/hooks/use-media-query'
import React, { useState, useCallback, useRef, useEffect } from 'react'

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
    const isMobile = useIsMobile();
    
    // Long press state management
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const longPressStarted = useRef(false);
    
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

    // Always transform the component during drag on both mobile and desktop
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeComponent(formComponentProps.id);
    };

    const handleComponentClick = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        // Don't activate on mobile if it's a long press
        if (isMobile && isLongPressing) return;
        
        // Set this component as active when clicked
        setActiveComponentId(formComponentProps.id);
    };

    // Long press handlers for mobile
    const startLongPress = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isMobile) return;
        
        longPressStarted.current = true;
        setIsLongPressing(false);
        
        // Clear any existing timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        
        // Start long press timer (400ms for visual feedback, 500ms for actual drag)
        longPressTimer.current = setTimeout(() => {
            if (longPressStarted.current) {
                setIsLongPressing(true);
                // Vibrate to indicate long press detected
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        }, 400);
    }, [isMobile]);

    const cancelLongPress = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        longPressStarted.current = false;
        setTimeout(() => setIsLongPressing(false), 100); // Small delay to show feedback
    }, []);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    // Combine all refs (drag, drop, and outside click detection)
    const setRefs = (element: HTMLDivElement | null) => {
        setDragRef(element);
        setDropRef(element);
        outsideClickRef.current = element;
    };

    return (
        <div
            ref={setRefs}
            onClick={handleComponentClick}
            data-dnd-kit-draggable={formComponentProps.id}
            data-dnd-kit-dragging={isDragging}
            // Mobile long press handlers
            onTouchStart={isMobile ? startLongPress : undefined}
            onTouchEnd={isMobile ? cancelLongPress : undefined}
            onTouchCancel={isMobile ? cancelLongPress : undefined}
            onMouseDown={isMobile ? startLongPress : undefined}
            onMouseUp={isMobile ? cancelLongPress : undefined}
            onMouseLeave={isMobile ? cancelLongPress : undefined}
            // Add drag attributes for mobile when long pressing
            {...(isMobile ? listeners : {})}
            {...(isMobile ? attributes : {})}
            className={`group relative py-2 px-2 rounded-lg bg-background transition-all cursor-pointer touch-manipulation select-none ${
                isDragging ? 'opacity-80 ring-2 ring-primary shadow-lg z-50 scale-105 rotate-2 bg-card border border-primary' : 
                isOver ? 'border-primary border-2 bg-primary/5' : ''
            } ${activeComponentId === formComponentProps.id ? 'shadow-[0_0_0_2px_rgba(0,0,255,0.5),_0_-1px_0_1px_rgba(0,0,255,0.5)]' : 'shadow-none'} ${
                isMobile && isLongPressing ? 'scale-105' : ''
            }`}
            style={{
                ...(style || {}),
                touchAction: isMobile ? 'none' : 'auto',
                transition: isDragging ? 'none' : 'all 0.2s ease',
                zIndex: isDragging ? 1000 : 1
            }}
        >


            {/* Drag handle and controls - Hidden on mobile, visible on desktop */}
            {!isMobile && (
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
                        data-dnd-kit-draggable-handle={formComponentProps.id}
                        className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}

            {/* Mobile delete button - only show when component is active */}
            {isMobile && activeComponentId === formComponentProps.id && (
                <div className="absolute top-2 right-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 bg-background/80 backdrop-blur-sm border border-border/50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Long press feedback overlay for mobile */}
            {isMobile && isLongPressing && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        Ready to drag
                    </div>
                </div>
            )}

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