
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
  FormLabel 
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
      default:
        return <div className='text-red-500'>Unknown Component</div>;
    }
  }

  // Use basic UI components for design mode (existing functionality)
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

export {
  renderComponent
}