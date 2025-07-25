"use client";

import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useFormStore, FormComponent } from '@/store/form';
import { Button, Input, Checkbox, Textarea, Select, Switch, Label } from '@/components/ui/form-fields'; // Assuming this path is correct
import Draggable from './draggable';

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
      return <Input
      
      placeholder={component.props?.placeholder} />;
    case 'Button':
      return <Button>{component.props?.label}</Button>;
    case 'Checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={component.id} />
          <Label htmlFor={component.id}>{component.props?.label}</Label>
        </div>
      );
    case 'Textarea':
        return <Textarea placeholder={component.props?.placeholder} />;
    case 'Select':
        return <Select><option>Default Option</option></Select>;
    case 'Switch':
        return (
            <div className="flex items-center space-x-2">
                <Switch id={component.id} />
                <Label htmlFor={component.id}>{component.props?.label}</Label>
            </div>
        );
    case 'Label':
        return <Label>{component.props?.label}</Label>;
    default:
      return <div className='text-red-500'>Unknown Component</div>;
  }
};

function FormCanvas() {
    // Get the components array from our zustand store
    const { components } = useFormStore();

    const { isOver, setNodeRef } = useDroppable({
        id: "form-canvas",
    });

    return (
        <main
            ref={setNodeRef}
            className={`flex-1 p-8 m-4 rounded-lg border-2 border-dashed transition-colors
                        ${isOver ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'}`}
        >
            {/* If there are no components, show a placeholder message */}
            {components.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-center text-muted-foreground">
                        Drag and drop form elements here
                    </p>
                </div>
            )}

            {/* If there are components, map over them and render them */}
            {components.length > 0 && (
                <div className="space-y-2">
                    <DropZone index={0} />
                    {components.map((component, index) => (
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
    );
}

export default FormCanvas;
