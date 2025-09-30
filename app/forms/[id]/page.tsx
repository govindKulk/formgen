"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormApi } from '@/hooks/use-form-api';
import FormCanvas from '@/components/form-canvas'
import FormCreateSidebar from '@/components/form-create-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import {DndContext, DragEndEvent, closestCenter, DragStartEvent, Active, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay} from '@dnd-kit/core'
import { useFormStore, FormComponentType } from '@/store/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical } from 'lucide-react'
import PropertiesPanel from '@/components/properties-panel'
import { updateFormSettings } from '@/lib/form-actions';
import toast from 'react-hot-toast';
import { ResponsiveLayout } from '@/components/responsive-layout';
import { debouncer } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-media-query';
import MobileDragDebug from '@/components/mobile-drag-debug';

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
    const {addComponent, steps, currentStepIndex, moveComponent, removeStep} = useFormStore();
    const [activeItem, setActiveItem] = useState<Active | null>(null);
    const isMobile = useIsMobile();
    
    // Configure sensors for better touch support
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8,
        },
    });
    
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: isMobile ? 500 : 100, // Long press (500ms) on mobile for drag activation
            tolerance: isMobile ? 8 : 10, // Reduced tolerance for more precise activation
        },
    });
    
    const sensors = useSensors(mouseSensor, touchSensor);
    
    // Get form store to track changes
    const formStore = useFormStore();

    // Create stable debounced save function that doesn't depend on changing saveForm
    const debouncedSaveForm = useRef<{ (...args: any[]): void; cancel(): void } | null>(null);
    const saveFormRef = useRef(saveForm);
    
    // Keep saveForm ref current
    useEffect(() => {
        saveFormRef.current = saveForm;
    }, [saveForm]);
    
    // Initialize debounced save function only once
    useEffect(() => {
        debouncedSaveForm.current = debouncer(10000, async () => {
            try {
                console.log("🔄 AUTO-SAVE triggered (debounced) with current state:", formStore.steps?.length || 0, "components");
                await saveFormRef.current(formId, formTitle);
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
    }, [formId, formTitle]); // Remove saveForm from dependencies
    
    // Track changes in form store with proper timing
    const prevFormStateRef = useRef(JSON.stringify(formStore));
    
    useEffect(() => {
        // Use setTimeout to ensure Zustand store has updated after state mutations

        if(isPreviewMode) return;

        const timeoutId = setTimeout(() => {
            const currentFormState = JSON.stringify({
                steps: formStore.steps.map((step: any) => ({
                    id: step.id,
                    stepTitle: step.stepTitle,
                    components: step.components
                })),
                title: formStore.title,
                primaryColor: formStore.theme.primaryColor,
                submissionMessage: formStore.submissionMessage,
                formData: formStore.formData,
                // Don't include currentStepIndex to avoid triggering saves on step navigation
            });
            
            if (isFormLoaded && prevFormStateRef.current !== currentFormState) {
                console.log("📝 Form changes detected, triggering AUTO-SAVE debouncer");
                console.log("Previous components count:", JSON.parse(prevFormStateRef.current)?.steps?.[0]?.components?.length || 0);
                console.log("Current components count:", JSON.parse(currentFormState)?.steps?.[0]?.components?.length || 0);
                
                debouncedSaveForm.current?.();
                hasUnsavedChanges.current = true;
                prevFormStateRef.current = currentFormState;
            }
        }, 0); // Use setTimeout 0 to defer until next tick

        return () => clearTimeout(timeoutId);
    }, [
        formStore.steps,
        formStore.title,
        formStore.theme.primaryColor,
        formStore.submissionMessage,
        formStore.formData,
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
                    steps: form.content.steps.map((step: any) => ({
                        id: step.id,
                        stepTitle: step.stepTitle,
                        components: step.components
                    })),
                    title: form.content.title,
                    primaryColor: form.content.primaryColor,
                    submissionMessage: form.content.submissionMessage,
                    formData: form.content.formData,
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
                console.log("🚪 UNMOUNT SAVE triggered");
                saveFormRef.current(formId).catch(error => {
                    console.error('Failed to auto-save form:', error);
                });
            }
            debouncedSaveForm.current?.cancel();

            // DON'T reset form data - this was causing the clearing issue
            // formStore.resetFormData();
        };
    }, [formId, isFormLoaded]);

    const handleSave = async () => {
        try {
            // For manual saves, bypass debouncing and save immediately
            console.log("💾 MANUAL SAVE triggered");
            await saveFormRef.current(formId);
            toast.success('Form saved successfully');
            hasUnsavedChanges.current = false;
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

    const handleDeleteStep = () => {
        if (steps.length <= 1) {
            toast.error('Cannot delete the last step');
            return;
        }
        
        if (confirm('Are you sure you want to delete this step? This action cannot be undone.')) {
            console.log("🗑️ DELETING STEP:", steps[currentStepIndex].stepTitle);
            removeStep(steps[currentStepIndex].id);
            toast.success('Step deleted successfully');
            // Auto-save will be triggered by the useEffect detecting the change
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
        
        // Add mobile feedback - stronger vibration for long press activation
        if (isMobile && 'vibrate' in navigator) {
            navigator.vibrate(50); // Longer vibration for drag start
        }
    };

    // Render drag overlay only for sidebar items (not canvas items)
    const renderDragOverlay = () => {
        if (!activeItem) return null;
        
        const activeData = activeItem.data.current;
        
        // Only show overlay for sidebar items being dragged to canvas
        if (activeData?.type && typeof activeData.type === 'string' && activeData.type !== "canvas-item") {
            const componentType = activeData.type as FormComponentType;
            
            return (
                <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90 transform rotate-3 scale-105">
                    {renderSidebarComponentPreview(componentType)}
                </div>
            );
        }
        
        return null;
    };

    // Helper function to render component previews for the drag overlay
    const renderSidebarComponentPreview = (type: FormComponentType) => {
        switch (type) {
            case 'Input':
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Text Input</label>
                        <Input placeholder="Enter text..." className="pointer-events-none" />
                    </div>
                );
            case 'Button':
                return <Button className="pointer-events-none">Button</Button>;
            case 'Textarea':
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Text Area</label>
                        <textarea 
                            className="w-full p-2 border rounded resize-none pointer-events-none"
                            rows={3}
                            placeholder="Enter long text..."
                        />
                    </div>
                );
            case 'Checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" className="pointer-events-none" />
                        <label className="text-sm">Checkbox Option</label>
                    </div>
                );
            case 'Select':
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Dropdown</label>
                        <select className="w-full p-2 border rounded pointer-events-none">
                            <option>Choose option...</option>
                        </select>
                    </div>
                );
            case 'Switch':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-4 bg-gray-300 rounded-full pointer-events-none"></div>
                        <label className="text-sm">Toggle Switch</label>
                    </div>
                );
            case 'Label':
                return <label className="text-sm font-medium pointer-events-none">Text Label</label>;
            case 'MCQ':
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Multiple Choice</label>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="mcq-preview" className="pointer-events-none" />
                                <label className="text-sm">Option 1</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="mcq-preview" className="pointer-events-none" />
                                <label className="text-sm">Option 2</label>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="p-2 border rounded text-sm">{type} Component</div>;
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveItem(null);
        
        // Add mobile feedback on successful drop
        if (over && isMobile && 'vibrate' in navigator) {
            navigator.vibrate(20);
        }
        
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
                                    onDeleteStep={handleDeleteStep}
                                />
                            }
                            rightSidebar={<PropertiesPanel />}
                        />
                        {/* DragOverlay for sidebar items only - canvas items move directly */}
                        <DragOverlay>
                            {renderDragOverlay()}
                        </DragOverlay>
                    </DndContext>
                </SidebarProvider>
            </div>
            <MobileDragDebug />
        </div>
    );
}