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
