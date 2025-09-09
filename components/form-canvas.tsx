"use client";

import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useFormStore, FormComponent, FormComponentType } from '@/store/form';
import { Button, Input, Checkbox, Textarea, Switch, Label } from '@/components/ui/form-fields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Draggable from './draggable';
import { StepNavigation } from './step-navigation';
import { FormWrapper } from './form-wrapper';
import { 
  FormInput, 
  FormTextarea, 
  FormSelect, 
  FormCheckbox, 
  FormSwitch, 
  FormButton, 
  FormLabel 
} from './form-fields-enhanced';
import { PlusIcon, Eye, Edit3, ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderComponent } from '@/lib/helper';
import { Badge } from '@/components/ui/badge';
import { FormSettingsDropdown } from '@/components/form-settings-dropdown';

interface FormCanvasProps {
  formId: string;
  formTitle: string;
  isPublished: boolean;
  shareUrl: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onSave: () => void;
  onTogglePublish: () => Promise<void>;
  onToggleAnonymous: (allow: boolean) => Promise<void>;
  onToggleDuplicates: (allow: boolean) => Promise<void>;
}

interface FormContentProps {
  title: string;
  currentStep: any;
  currentStepIndex: number;
  steps: any[];
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  components: FormComponent[];
}

 const FormContent = ({
   title,
   currentStep,
   currentStepIndex,
   steps,
   isPreviewMode,
   setIsPreviewMode,
   components
 }: FormContentProps) => (
        <>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl py-2 font-semibold">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {currentStep?.stepTitle} ({currentStepIndex + 1} of {steps.length})
                        </p>
                    </div>
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="flex items-center gap-2 p-2 border rounded-[100%] border-zinc-800  text-zinc-800 -sm hover:bg-zinc-800
                        hover:text-white cursor-pointer transition-all duration-200 shadow-lg hover:shadow-md"
                    >
                        {isPreviewMode ? (
                            <>
                                <Edit3 className="w-4 h-4" />

                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />

                            </>
                        )}
                    </button>
                </div>
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
                    {!isPreviewMode && <DropZone index={0} />}
                    {components.map((component: FormComponent, index: number) => (
                        <React.Fragment key={component.id}>
                            {isPreviewMode ? (
                                <div className="mb-4 py-2 px-2">
                                    {renderComponent(component, true)}
                                </div>
                            ) : (
                                <Draggable 
                                    formComponentProps={component}
                                    index={index}
                                >
                                    {renderComponent(component, false)}
                                </Draggable>
                            )}
                            {!isPreviewMode && <DropZone index={index + 1} />}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    );

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

// // A helper function to render the correct shadcn/ui component based on its type
// const renderComponent = (component: FormComponent, isPreviewMode: boolean = false) => {
//   if (isPreviewMode) {
//     // Use enhanced form fields with React Hook Form integration in preview mode
//     switch (component.type) {
//       case 'Input':
//         return <FormInput component={component} />;
//       case 'Textarea':
//         return <FormTextarea component={component} />;
//       case 'Select':
//         return <FormSelect component={component} />;
//       case 'Checkbox':
//         return <FormCheckbox component={component} />;
//       case 'Switch':
//         return <FormSwitch component={component} />;
//       case 'Button':
//         return <FormButton component={component} />;
//       case 'Label':
//         return <FormLabel component={component} />;
//       default:
//         return <div className='text-red-500'>Unknown Component</div>;
//     }
//   }

//   // Use basic UI components for design mode (existing functionality)
//   switch (component.type) {
//     case 'Input':
//       return <Input placeholder={component.props?.placeholder || 'Enter text...'} />;
//     case 'Button':
//       return <Button>{component.props?.buttonText || component.props?.label || 'Button'}</Button>;
//     case 'Checkbox':
//       return (
//         <div className="flex items-center space-x-2">
//           <Checkbox id={component.id} />
//           <Label htmlFor={component.id}>
//             {component.props?.checkboxText || component.props?.label || 'Checkbox'}
//           </Label>
//         </div>
//       );
//     case 'Textarea':
//       return (
//         <Textarea 
//           placeholder={component.props?.placeholder || 'Enter text...'} 
//           rows={component.props?.textareaRows || 3}
//         />
//       );
//     case 'Select':
//       return (
//         <Select>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select an option..." />
//           </SelectTrigger>
//           <SelectContent>
//             {(component.props?.options || ['Option 1', 'Option 2']).map((option, index) => (
//               <SelectItem key={index} value={option}>
//                 {option}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       );
//     case 'Switch':
//       return (
//         <div className="flex items-center space-x-2">
//           <Switch id={component.id} />
//           <Label htmlFor={component.id}>
//             {component.props?.switchText || component.props?.label || 'Switch'}
//           </Label>
//         </div>
//       );
//     case 'Label':
//       return <Label>{component.props?.labelText || component.props?.label || 'Label'}</Label>;
//     default:
//       return <div className='text-red-500'>Unknown Component</div>;
//   }
// };

function FormCanvas({
  formId,
  formTitle,
  isPublished,
  shareUrl,
  isSaving,
  hasUnsavedChanges,
  onBack,
  onSave,
  onTogglePublish,
  onToggleAnonymous,
  onToggleDuplicates
}: FormCanvasProps) {
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
    const [isPreviewMode, setIsPreviewMode] = React.useState(false);
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
    
    const handleFormSubmit = (data: any) => {
        console.log('Form submitted:', data);
        // Handle form submission here
    };

    const isMovingForward = currentStepIndex > previousStepIndexRef.current;

    
    
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
    

    console.log("FormCanvas rendered with current step index:", currentStepIndex);
   
    
    return (
        <div className='h-fit w-full relative flex flex-col'>
            {/* Header with save/publish controls */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
                <div className="flex h-14 items-center px-4">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Forms
                        </Button>
                        
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-lg truncate max-w-[300px]">
                                {title || formTitle}
                            </h1>
                            <Badge variant={isPublished ? "default" : "secondary"}>
                                {isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <FormSettingsDropdown
                            formId={formId}
                            onTogglePublish={onTogglePublish}
                            onToggleAnonymous={onToggleAnonymous}
                            onToggleDuplicates={onToggleDuplicates}
                            isLoading={isSaving}
                        />
                        
                        {isPublished && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/s/${shareUrl || 'preview'}`, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        )}
                        
                        <Button
                            onClick={onSave}
                            disabled={isSaving || !hasUnsavedChanges}
                            size="sm"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

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
                        {isPreviewMode ? (
                            <FormWrapper onSubmit={handleFormSubmit} className="max-w-lg mx-auto">
                                <main
                                    className={`p-8 rounded-lg border-2 bg-white max-w-lg mx-auto h-fit min-h-[600px] relative`}
                                >
                                    <FormContent 
                                        title={title}
                                        currentStep={currentStep}
                                        currentStepIndex={currentStepIndex}
                                        steps={steps}
                                        isPreviewMode={isPreviewMode}
                                        setIsPreviewMode={setIsPreviewMode}
                                        components={components}
                                    />
                                </main>
                            </FormWrapper>
                        ) : (
                            <main
                                ref={setNodeRef}
                                onClick={handleCanvasClick}
                                className={`flex-1 p-8 rounded-lg border-2 border-dashed max-w-lg mx-auto transition-colors h-fit min-h-[600px] relative
                                            ${isOver ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'}`}
                            >
                                <FormContent
                                    title={title}
                                    currentStep={currentStep}
                                    currentStepIndex={currentStepIndex}
                                    steps={steps}
                                    isPreviewMode={isPreviewMode}
                                    setIsPreviewMode={setIsPreviewMode}
                                    components={components}
                                />
                            </main>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Step Navigation - only show in design mode */}
            {!isPreviewMode && (
                <div className="mt-6 px-8">
                    <StepNavigation />
                </div>
            )}

            {/* Add Step Button - only show in design mode */}
            {!isPreviewMode && (
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
            )}
        </div>
    );
}

export default FormCanvas;
