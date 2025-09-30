"use client";

import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Input as UIInput } from '@/components/ui/input';
import { Textarea as UITextarea } from '@/components/ui/textarea';
import { Checkbox as UICheckbox } from '@/components/ui/checkbox';
import { Switch as UISwitch } from '@/components/ui/switch';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button as UIButton } from '@/components/ui/button';
import { FormComponent } from '@/store/form';

interface FormFieldProps {
    component: FormComponent;
    className?: string;
}

export function FormInput({ component, className = '' }: FormFieldProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: ''
    });



    const error = errors[component.id]?.message as string;

    return (
        <div className={`space-y-2 ${className}`}>
            {component.showLabel && component.props.label && (
                <Label htmlFor={component.id} className={component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
                    {component.props.label}
                </Label>
            )}
            <UIInput
                {...field}
                id={component.id}
                type={component.props.inputType || 'text'}
                placeholder={component.props.placeholder}
                className={error ? 'border-red-500' : ''}
                style={{
                }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export function FormTextarea({ component, className = '' }: FormFieldProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: ''
    });

    const error = errors[component.id]?.message as string;

    return (
        <div className={`space-y-2 ${className}`}>
            {component.showLabel && component.props.label && (
                <Label htmlFor={component.id} className={component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
                    {component.props.label}
                </Label>
            )}
            <UITextarea
                {...field}
                id={component.id}
                placeholder={component.props.placeholder}
                rows={component.props.textareaRows || 3}
                className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export function FormSelect({ component, className = '' }: FormFieldProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: ''
    });

    const error = errors[component.id]?.message as string;

    return (
        <div className={`space-y-2 ${className}`}>
            {component.showLabel && component.props.label && (
                <Label htmlFor={component.id} className={component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
                    {component.props.label}
                </Label>
            )}
            <UISelect value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                    {(component.props.options || []).map((option, index) => (
                        <SelectItem key={index} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </UISelect>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export function FormCheckbox({ component, className = '' }: FormFieldProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: false
    });

    const error = errors[component.id]?.message as string;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center space-x-2">
                <UICheckbox
                    id={component.id}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                <Label
                    htmlFor={component.id}
                    className={component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}
                >
                    {component.props.checkboxText || component.props.label || 'Checkbox'}
                </Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export function FormSwitch({ component, className = '' }: FormFieldProps) {
    const { control } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: false
    });

    return (
        <div className={`flex flex-col items-start space-y-2 space-x-2 ${className}`}>
            {component.showLabel && component.props.label && (
                <Label htmlFor={component.id} className={component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
                    {component.props.label}
                </Label>
            )}
            <div
            className='space-x-2 flex items-center'
            >
                <UISwitch
                    id={component.id}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                <Label htmlFor={component.id}>
                    {component.props.switchText || component.props.label || 'Switch'}
                </Label>
            </div>
        </div>
    );
}

export function FormButton({ component, className = '' }: FormFieldProps) {
    return (
        <UIButton type="button" className={className}>
            {component.props.buttonText || component.props.label || 'Button'}
        </UIButton>
    );
}

export function FormLabel({ component, className = '' }: FormFieldProps) {
    return (
        <Label className={className}>
            {component.props.labelText || component.props.label || 'Label'}
        </Label>
    );
}

export function FormMCQ({ component, className = '' }: FormFieldProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({
        name: component.id,
        control,
        defaultValue: component.quiz?.isMultipleChoice ? [] : ''
    });

    const error = errors[component.id]?.message as string;
    const options = component.props.options || ['Option A', 'Option B', 'Option C', 'Option D'];
    const isMultipleChoice = component.quiz?.isMultipleChoice || false;

    const handleOptionChange = (optionValue: string) => {
        if (isMultipleChoice) {
            const currentValue = field.value || [];
            const newValue = currentValue.includes(optionValue)
                ? currentValue.filter((v: string) => v !== optionValue)
                : [...currentValue, optionValue];
            field.onChange(newValue);
        } else {
            field.onChange(optionValue);
        }
    };

    const isSelected = (optionValue: string) => {
        if (isMultipleChoice) {
            return (field.value || []).includes(optionValue);
        }
        return field.value === optionValue;
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {component.props.label && (
                <Label className={`text-base font-medium ${component.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}`}>
                    {component.props.label}
                </Label>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                            isSelected(option) ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                        onClick={() => handleOptionChange(option)}
                    >
                        <div className={`w-4 h-4 border-2 transition-all ${
                            isMultipleChoice ? 'rounded-sm' : 'rounded-full'
                        } ${
                            isSelected(option) 
                                ? 'border-primary bg-primary' 
                                : 'border-gray-300'
                        }`}>
                            {isSelected(option) && (
                                <div className={`w-full h-full flex items-center justify-center ${
                                    isMultipleChoice ? '' : 'rounded-full'
                                }`}>
                                    {isMultipleChoice ? (
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            {option}
                        </span>
                    </div>
                ))}
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
