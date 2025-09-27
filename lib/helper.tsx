
import { useFormStore, FormComponent, FormComponentType } from '@/store/form';
import { Button, Input, Checkbox, Textarea, Switch, Label } from '@/components/ui/form-fields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  FormInput, 
  FormTextarea, 
  FormSelect, 
  FormCheckbox, 
  FormSwitch, 
  FormButton, 
  FormLabel,
  FormMCQ
} from '@/components/form-fields-enhanced';
import React from 'react';

const renderComponent = (component: FormComponent, isPreviewMode: boolean = false) : React.JSX.Element => {
  if (isPreviewMode) {
    // Use enhanced form fields with React Hook Form integration in preview mode
    switch (component.type) {
      case 'Input':
        return <FormInput component={component} />;
      case 'Textarea':
        return <FormTextarea component={component} />;
      case 'Select':
        return <FormSelect component={component} />;
      case 'Checkbox':
        return <FormCheckbox component={component} />;
      case 'Switch':
        return <FormSwitch component={component} />;
      case 'Button':
        return <FormButton component={component} />;
      case 'Label':
        return <FormLabel component={component} />;
      case 'MCQ':
        return <FormMCQ component={component} />;
      default:
        return <div className='text-red-500'>Unknown Component</div>;
    }
  }

  // Design Mode
  switch (component.type) {
    case 'Input':
      return <Input className='pointer-events-none' placeholder={component.props?.placeholder || 'Enter text...'} />;
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
    case 'MCQ':
      return (
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {component.props?.label || 'Multiple Choice Question'}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(component.props?.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className={`w-4 h-4 border-2 border-gray-300 ${
                  component.quiz?.isMultipleChoice ? 'rounded-sm' : 'rounded-full'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div className='text-red-500'>Unknown Component</div>;
  }
};

const debounce = (func: Function, delay: number) => {
  let timeOutId: NodeJS.Timeout;

  return (...args: any[]) => {
    if (timeOutId) clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export {
  renderComponent,
  debounce
}