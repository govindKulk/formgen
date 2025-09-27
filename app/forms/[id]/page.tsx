"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormApi } from '@/hooks/use-form-api';
import FormCanvas from '@/components/form-canvas'
import FormCreateSidebar from '@/components/form-create-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import {DndContext, DragEndEvent, DragOverlay, closestCenter, DragStartEvent, Active, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core'
import { useFormStore, FormComponentType } from '@/store/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical } from 'lucide-react'
import PropertiesPanel from '@/components/properties-panel'
import { updateFormSettings } from '@/lib/form-actions';
import toast from 'react-hot-toast';
import { ResponsiveLayout } from '@/components/responsive-layout';
import { debouncer } from '@/lib/utils';

export default function FormEditPage() {
    const params = useParams();
    const router = useRouter();
    const formId = params.id as string;

    const [isPreviewMode, setIsPreviewMode] = useState(false);
    
    // API integration state
    const [isFormLoaded, setIsFormLoaded] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const hasUnsavedChanges = useRef(false);
    
    const { loadForm, saveForm, togglePublish, isLoading, isSaving } = useFormApi({
        onSuccess: (message) => {
            console.log('Success:', message);
            hasUnsavedChanges.current = false;
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    // Original DnD functionality
    const {addComponent, steps, currentStepIndex, moveComponent} = useFormStore();
    const [activeItem, setActiveItem] = useState<Active | null>(null);
    
    // Configure sensors for better touch support
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8,
        },
    });
    
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 8,
        },
    });
    
    const sensors = useSensors(mouseSensor, touchSensor);
    
    // Get form store to track changes
    const formStore = useFormStore();

    const debouncedSaveForm = useRef<{ (...args: any[]): void; cancel(): void } | null>(null);
    
    // Initialize debounced save function
    useEffect(() => {
        debouncedSaveForm.current = debouncer(10000, async () => {
            try {
                console.log("Auto-saving form with current state:", formStore.steps);
                await saveForm(formId, formTitle);
                toast.success('Form auto-saved');
                hasUnsavedChanges.current = false;
            } catch(error){
                console.error('Auto-save failed:', error);
                toast.error('Failed to auto-save form');
            }
        });

        return () => {
            debouncedSaveForm.current?.cancel();
        };
    }, [formId, formTitle, saveForm]);
    
    // Track changes in form store with proper timing
    const prevFormStateRef = useRef(JSON.stringify(formStore));
    
    useEffect(() => {
        // Use setTimeout to ensure Zustand store has updated after state mutations

        if(isPreviewMode) return;

        const timeoutId = setTimeout(() => {
            const currentFormState = JSON.stringify({
                steps: formStore.steps,
                title: formStore.title,
                primaryColor: formStore.theme.primaryColor,
                submissionMessage: formStore.submissionMessage,
                formData: formStore.formData,
                currentStepIndex: formStore.currentStepIndex
            });
            
            if (isFormLoaded && prevFormStateRef.current !== currentFormState) {
                console.log("Form has unsaved changes, triggering auto-save");
                console.log("Previous state:", JSON.parse(prevFormStateRef.current));
                console.log("Current state:", JSON.parse(currentFormState));
                
                debouncedSaveForm.current?.();
                hasUnsavedChanges.current = true;
                prevFormStateRef.current = currentFormState;
            }
        }, 0); // Use setTimeout 0 to defer until next tick

        return () => clearTimeout(timeoutId);
    }, [
        formStore.steps,
        formStore.title,
        formStore.submissionMessage,
        formStore.formData,
        formStore.submissionMessage,
        isFormLoaded,
    ]);

    // Load form data on mount
    useEffect(() => {
        const loadFormData = async () => {
            try {
                const form = await loadForm(formId);
                setFormTitle(form.title);
                setIsPublished(form.published);
                setShareUrl(form.shareUrl);
                setIsFormLoaded(true);
                
                // Set initial state for comparison
                prevFormStateRef.current = JSON.stringify({
                    steps: form.content.steps,
                    title: form.content.title,
                    primaryColor: form.content.primaryColor,
                    submissionMessage: form.content.submissionMessage,
                    formData: form.content.formData,
                    currentStepIndex: form.content.currentStepIndex
                });
            } catch (error) {
                console.error('Failed to load form:', error);
                router.push('/forms');
            }
        };

        if (formId) {
            loadFormData();
        }


    }, [formId]);

    // Auto-save when component unmounts
    useEffect(() => {
        return () => {
            if (hasUnsavedChanges.current && isFormLoaded) {
                saveForm(formId).catch(error => {
                    console.error('Failed to auto-save form:', error);
                });
            }
            debouncedSaveForm.current?.cancel();

            // DON'T reset form data - this was causing the clearing issue
            // formStore.resetFormData();
        };
    }, [formId, isFormLoaded, saveForm]);

    const handleSave = async () => {
        try {
            await saveForm(formId);
            toast.success('Form saved successfully');
        } catch (error) {
            console.error('Failed to save form:', error);
            toast.error('Failed to save form');
        }
    };

    const handleTogglePublish = async () => {
        try {
            const newStatus = !isPublished;
            await togglePublish(formId, newStatus);
            setIsPublished(newStatus);
            toast.success(
                newStatus ? 'Form published successfully from page.tsx' : 'Form unpublished successfully from page.tsx'
            );
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            toast.error('Failed to update publish status');
        }
    };

    const handleToggleAnonymous = async (allow: boolean) => {
        const result = await updateFormSettings(formId, { allowAnonymous: allow });
        if (!result.success) {
            throw new Error(result.message);
        }
    };

    const handleToggleDuplicates = async (allow: boolean) => {
        const result = await updateFormSettings(formId, { allowDuplicates: allow });
        if (!result.success) {
            console.error("erorr")
            throw new Error(result.message);
        }
    };

    const handleBack = () => {
        if (hasUnsavedChanges.current) {
            if (confirm('You have unsaved changes. Do you want to save before leaving?')) {
                handleSave().then(() => {
                    router.push('/forms');
                });
                return;
            }
        }
        router.push('/forms');
    };
    
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
            const componentCount = steps[currentStepIndex].components.length;
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
                <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg shadow-lg opacity-95 pointer-events-none">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">{activeData.type}</span>
                        <div className="w-full">
                            {activeData.type === "Input" && <Input className="h-6 text-xs pointer-events-none" placeholder="Type here..." />}
                            {activeData.type === "Button" && <Button size="sm" className="h-6 text-xs pointer-events-none">Click me</Button>}
                            {activeData.type === "Textarea" && <div className="border border-border rounded p-1 text-xs w-32 h-6 flex items-center text-foreground bg-background">Textarea</div>}
                            {activeData.type === "Checkbox" && <div className="flex items-center gap-1"><input type="checkbox" className="pointer-events-none" /><span className="text-xs text-foreground">Checkbox</span></div>}
                            {activeData.type === "Select" && <select className="border border-border rounded px-1 text-xs h-6 w-24 pointer-events-none bg-background text-foreground"><option>Select</option></select>}
                            {activeData.type === "Switch" && <div className="flex items-center gap-1"><div className="w-6 h-3 bg-border rounded-full"><div className="w-2 h-2 bg-background rounded-full mt-0.5 ml-0.5"></div></div><span className="text-xs text-foreground">Switch</span></div>}
                            {activeData.type === "Label" && <label className="text-xs font-medium text-foreground">Label text</label>}
                            {activeData.type === "Dialog" && <div className="border border-border rounded px-2 py-1 text-xs text-foreground bg-background">Dialog</div>}
                            {activeData.type === "Tooltip" && <div className="border border-border rounded px-2 py-1 text-xs text-foreground bg-background">Tooltip</div>}
                        </div>
                    </div>
                </div>
            );
        }

        // If dragging canvas item - make it smaller and without tilt
        if (activeData?.type === 'canvas-item') {
            const component = activeData.formComponent;
            return (
                <div className="p-3 bg-card border border-border rounded-lg shadow-lg opacity-95 min-w-[150px] max-w-[200px] pointer-events-none">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                        <div>
                            <div className="text-xs font-medium text-foreground">{component.type}</div>
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

    // Show loading state
    if (isLoading || !isFormLoaded) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Responsive layout with DnD */}
            <div className="flex-1">
                <SidebarProvider>
                    <DndContext 
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        collisionDetection={closestCenter}
                        sensors={sensors}
                    >
                        <ResponsiveLayout
                            leftSidebar={<FormCreateSidebar />}
                            canvas={
                                <FormCanvas
                                    formId={formId}
                                    formTitle={formTitle}
                                    isPublished={isPublished}
                                    theme={formStore.theme}
                                    shareUrl={shareUrl}
                                    isSaving={isSaving}
                                    hasUnsavedChanges={hasUnsavedChanges.current}
                                    isPreviewMode={isPreviewMode}
                                    setIsPreviewMode={setIsPreviewMode}
                                    onBack={handleBack}
                                    onSave={handleSave}
                                    onTogglePublish={handleTogglePublish}
                                    onToggleAnonymous={handleToggleAnonymous}
                                    onToggleDuplicates={handleToggleDuplicates}
                                />
                            }
                            rightSidebar={<PropertiesPanel />}
                        />
                        <DragOverlay>
                            {renderDragOverlay()}
                        </DragOverlay>
                    </DndContext>
                </SidebarProvider>
            </div>
        </div>
    );
}