"use client";

import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useFormStore, FormComponent } from '@/store/form';
import { Button, Input, Checkbox, Textarea, Switch, Label } from '@/components/ui/form-fields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Draggable from './draggable';
import { StepNavigation } from './step-navigation';
import { PlusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component to handle drop zones between components
function DropZone({ index }: { index: number }) {
    const { isOver, setNodeRef } = useDroppable({
        id: `drop-zone-${index}`,
        data: { type: 'drop-zone', index }
    });

    return (
        <div
            ref={setNodeRef}
            className={`h-2 transition-all ${
                isOver ? 'h-8 bg-primary/20 border-2 border-dashed border-primary rounded' : ''
            }`}
        />
    );
}

// A helper function to render the correct shadcn/ui component based on its type
const renderComponent = (component: FormComponent) => {
  switch (component.type) {
    case 'Input':
      return <Input placeholder={component.props?.placeholder || 'Enter text...'} />;
    case 'Button':
      return <Button>{component.props?.buttonText || component.props?.label || 'Button'}</Button>;
    case 'Checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={component.id} />
          <Label htmlFor={component.id}>
            {component.props?.checkboxText || component.props?.label || 'Checkbox'}
          </Label>
        </div>
      );
    case 'Textarea':
      return (
        <Textarea 
          placeholder={component.props?.placeholder || 'Enter text...'} 
          rows={component.props?.textareaRows || 3}
        />
      );
    case 'Select':
      return (
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {(component.props?.options || ['Option 1', 'Option 2']).map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'Switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={component.id} />
          <Label htmlFor={component.id}>
            {component.props?.switchText || component.props?.label || 'Switch'}
          </Label>
        </div>
      );
    case 'Label':
      return <Label>{component.props?.labelText || component.props?.label || 'Label'}</Label>;
    default:
      return <div className='text-red-500'>Unknown Component</div>;
  }
};

function FormCanvas() {
    const { 
        steps, 
        currentStepIndex, 
        title, 
        setActiveComponentId, 
        addStep,
        getCurrentStepComponents 
    } = useFormStore();

    const previousStepIndexRef = React.useRef(currentStepIndex);
    const [animationDirection, setAnimationDirection] = React.useState<'forward' | 'backward' | 'none'>('none');
    const currentStep = steps[currentStepIndex];
    const components = getCurrentStepComponents();

    // Calculate and store direction in state for immediate use
    React.useEffect(() => {
        // if (currentStepIndex > previousStepIndexRef.current) {
        //     setAnimationDirection('forward');
        // } else if (currentStepIndex < previousStepIndexRef.current) {
        //     setAnimationDirection('backward');
        // } else {
        //     setAnimationDirection('none');
        // }
        previousStepIndexRef.current = currentStepIndex;
    }, [currentStepIndex]);

    const { isOver, setNodeRef } = useDroppable({
        id: "form-canvas",
    });

    // Handle clicks on the canvas background to deactivate components
    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only deactivate if clicking directly on the canvas (not on a child component)
        if (e.target === e.currentTarget) {
            setActiveComponentId(undefined);
        }
    };

    const handleAddStep = () => {
        addStep();
    };
    const isMovingForward = currentStepIndex > previousStepIndexRef.current;

    console.log("Current Step Index:", currentStepIndex, "Previous Step Index:", previousStepIndexRef.current, "Direction:", animationDirection);
    
    // Animation variants based on direction
    const getAnimationProps = () => {
        if (isMovingForward) {
            return {
                initial: { x: '100%', opacity: 0 },
                exit: { x: '-100%', opacity: 0 }
            };
        } else {
            return {
                initial: { x: '-100%', opacity: 0 },
                exit: { x: '100%', opacity: 0 }
            };
        }
    };

    const animationProps = getAnimationProps();
    
    return (
        <div className='h-fit w-full relative flex flex-col'>
            {/* Step Container with Sliding Animation */}

            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStepIndex}
                        initial={animationProps.initial}
                        animate={{ x: 0, opacity: 1 }}
                        exit={animationProps.exit}
                        transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.3
                        }}
                        className="w-full"
                    >
                        <main
                            ref={setNodeRef}
                            onClick={handleCanvasClick}
                            className={`flex-1 p-8 rounded-lg border-2 border-dashed max-w-lg mx-auto transition-colors h-fit min-h-[600px] relative
                                        ${isOver ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'}`}
                        >
                            <div>
                                <h2 className="text-2xl py-2 font-semibold">
                                    {title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    {currentStep?.stepTitle} ({currentStepIndex + 1} of {steps.length})
                                </p>
                            </div>

                            {/* If there are no components, show a placeholder message */}
                            {components.length === 0 && (
                                <div className="flex items-center justify-center h-full w-full absolute top-0 left-0">
                                    <p className="text-center text-muted-foreground">
                                        Drag and drop form elements here
                                    </p>
                                </div>
                            )}

                            {/* If there are components, map over them and render them */}
                            {components.length > 0 && (
                                <div className="">
                                    <DropZone index={0} />
                                    {components.map((component: FormComponent, index: number) => (
                                        <React.Fragment key={component.id}>
                                            <Draggable 
                                                formComponentProps={component}
                                                index={index}
                                            >
                                                {renderComponent(component)}
                                            </Draggable>
                                            <DropZone index={index + 1} />
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </main>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Step Navigation */}
            <div className="mt-6 px-8">
                <StepNavigation />
            </div>

            {/* Add Step Button */}
            <motion.button
                onClick={handleAddStep}
                whileHover={{
                    opacity: 0.8,
                    scale: 0.95,
                }}
                className='bg-blue-600 group flex gap-1 items-center text-white font-bold py-2 px-4 rounded-2xl shadow-lg absolute -bottom-12 right-0 text-sm hover:bg-blue-600/50 hover:text-black hover:shadow-md transition-all cursor-pointer overflow-hidden'
            >
                Add Step
                <PlusIcon className="h-4 w-4 ml-2" />
            </motion.button>
        </div>
    );
}

export default FormCanvas;
