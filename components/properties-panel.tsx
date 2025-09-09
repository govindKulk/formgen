"use client";

import { FormComponent, useFormStore } from '@/store/form'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Eye, EyeClosed, Trash } from 'lucide-react';
import { ThemeCustomization } from './theme-customization';

const FormProperties: React.FC = () => {

    const formStore = useFormStore();
    const [show, setShow] = useState(true);

    return (
        <div
            className='flex flex-col gap-4 p-4 border-b border-border'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Form Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>

            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'
            >
                <div>
                    <label htmlFor="form-title" className="block text-sm font-medium mb-2">Form Title</label>
                    <input
                        type="text"
                        id="form-title"
                        className="w-full p-1 text-sm border rounded"
                        value={formStore.title}
                        onChange={(e) => formStore.setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="form-step-title" className="block text-sm font-medium mb-2">Form Step Title</label>
                    <input
                        type="text"
                        id="form-step-title"
                        className="w-full p-1 text-sm border rounded"
                        value={formStore.steps[formStore.currentStepIndex].stepTitle}
                        onChange={(e) => formStore.setStepTitle(e.target.value, formStore.currentStepIndex)}
                    />
                </div>
                <div>
                    <label htmlFor="form-submission-message" className="block text-sm font-medium mb-2">Submission Message</label>
                    <input
                        type="text"
                        id="form-submission-message"
                        className="w-full p-1 text-sm border rounded"
                        value={formStore.submissionMessage}
                        onChange={(e) => formStore.setSubmissionMessage(e.target.value)}
                    />
                </div>
                
                {/* Current Step Info */}
                <div>
                    <label className="block text-sm font-medium mb-2">Current Step</label>
                    <div className="flex items-center justify-between p-2 bg-muted rounded border">
                        <span className="text-sm text-foreground">
                            Step {formStore.currentStepIndex + 1} of {formStore.steps.length}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formStore.steps[formStore.currentStepIndex]?.stepTitle}
                        </span>
                    </div>
                    
                    {/* Step Navigation Buttons */}
                    {formStore.steps.length > 1 && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => formStore.setCurrentStep(Math.max(0, formStore.currentStepIndex - 1))}
                                disabled={formStore.currentStepIndex === 0}
                                className="flex-1 px-2 py-1 text-xs bg-muted hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => formStore.setCurrentStep(Math.min(formStore.steps.length - 1, formStore.currentStepIndex + 1))}
                                disabled={formStore.currentStepIndex === formStore.steps.length - 1}
                                className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="primary-color" className="block text-sm font-medium mb-2">Primary Color</label>
                    <input
                        type="color"
                        id="primary-color"
                        className="w-full h-8 border rounded cursor-pointer"
                        value={formStore.theme.primaryColor}
                        onChange={(e) => formStore.setTheme({primaryColor: e.target.value})}
                    />
                </div>
            </motion.div>
        </div>
    )
}

const CommonProperties: React.FC<{
    activeComponent: FormComponent | undefined,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void,
    removeComponent: (id: string) => void
}> = ({ activeComponent, updateComponent, updateComponentMeta, removeComponent }) => {

    const [show, setShow] = useState(true);

    if (!activeComponent) {
        return;
    }

    return (
    <AnimatePresence >
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-4 p-4 border-b border-border'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Common Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>

            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                
                {/* Required Field Toggle */}
                {['Input', 'Textarea', 'Select', 'Checkbox', 'MCQ'].includes(activeComponent.type) && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <input
                                type="checkbox"
                                checked={activeComponent.required || false}
                                onChange={(e) => updateComponentMeta(activeComponent.id, { required: e.target.checked })}
                                className="rounded border-border"
                            />
                            Required Field
                        </label>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium mb-2 flex justify-between items-center">
                    Label

                    <span
                    className='cursor-pointer '
                    onClick={() => {
                        updateComponentMeta(activeComponent.id, { showLabel: !activeComponent.showLabel });
                    }}
                    >
                        {activeComponent.showLabel ?  <Eye className="w-4 h-4 text-muted-foreground" /> :
                            <EyeClosed className="w-4 h-4 text-muted-foreground" />}
                    </span>
                </label>
                <input
                    type="text"
                    disabled={!activeComponent.showLabel}
                    className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                    value={!activeComponent.showLabel ? 'None' : activeComponent.props?.label || ''}
                    onChange={(e) => {
                        updateComponent(activeComponent.id, { label: e.target.value });
                    }}
                />
            </div>

            <div>
                {/* delete the field */}
                <div
                    className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-red-50 transition-colors group'
                    onClick={() => {
                        if (confirm("Are you sure you want to delete this component?")) {
                            removeComponent(activeComponent.id);
                        }
                    }}
                >
                    <Trash
                        className="w-4 h-4 text-red-500 group-hover:text-red-700"
                    />
                    <div className="text-sm text-red-600 group-hover:text-red-700">Delete Component</div>
                </div>
            </div>
            {/* Add more property fields as needed */}
        </motion.div>
    </motion.div>
    </AnimatePresence>
    )
}

// Input-specific properties
const InputProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void,
}> = ({ activeComponent, updateComponent, updateComponentMeta }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Input Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                
                {/* Input Type Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Input Type</label>
                    <select
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.inputType || 'text'}
                        onChange={(e) => updateComponent(activeComponent.id, { inputType: e.target.value as any })}
                    >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="password">Password</option>
                        <option value="number">Number</option>
                        <option value="tel">Phone</option>
                        <option value="url">URL</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Placeholder Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.placeholder || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { placeholder: e.target.value })}
                    />
                </div>

                {/* Validation Options */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Validation</label>
                    <div className="space-y-3 border border-border rounded p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Min Length</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={activeComponent.validation?.minLength || ''}
                                    onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                        validation: { 
                                            ...activeComponent.validation, 
                                            minLength: e.target.value ? parseInt(e.target.value) : undefined 
                                        } 
                                    })}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Max Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={activeComponent.validation?.maxLength || ''}
                                    onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                        validation: { 
                                            ...activeComponent.validation, 
                                            maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                                        } 
                                    })}
                                    placeholder="∞"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">Custom Pattern (RegEx)</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                value={activeComponent.validation?.pattern || ''}
                                onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                    validation: { 
                                        ...activeComponent.validation, 
                                        pattern: e.target.value || undefined 
                                    } 
                                })}
                                placeholder="^[A-Za-z]+$"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">Custom Error Message</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                value={activeComponent.validation?.errorMessage || ''}
                                onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                    validation: { 
                                        ...activeComponent.validation, 
                                        errorMessage: e.target.value || undefined 
                                    } 
                                })}
                                placeholder="Custom validation error message"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Select-specific properties
const SelectProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
}> = ({ activeComponent, updateComponent }) => {
    const [show, setShow] = useState(true);
    const [newOption, setNewOption] = useState('');

    const addOption = () => {
        if (newOption.trim()) {
            const currentOptions = activeComponent.props?.options || [];
            updateComponent(activeComponent.id, {
                options: [...currentOptions, newOption.trim()]
            });
            setNewOption('');
        }
    };

    const removeOption = (index: number) => {
        const currentOptions = activeComponent.props?.options || [];
        const newOptions = currentOptions.filter((_, i) => i !== index);
        updateComponent(activeComponent.id, { options: newOptions });
    };

    const updateOption = (index: number, newValue: string) => {
        const currentOptions = activeComponent.props?.options || [];
        const newOptions = [...currentOptions];
        newOptions[index] = newValue;
        updateComponent(activeComponent.id, { options: newOptions });
    };

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Select Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Options</label>
                    <div className="space-y-2">
                        {(activeComponent.props?.options || []).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                                <button
                                    onClick={() => removeOption(index)}
                                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                    title="Remove option"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <input
                                type="text"
                                placeholder="+ Add new option"
                                className="flex-1 p-2 text-sm border border-dashed border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-solid"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addOption()}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Button-specific properties
const ButtonProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
}> = ({ activeComponent, updateComponent }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Button Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Button Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.buttonText || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { buttonText: e.target.value })}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// Checkbox-specific properties
const CheckboxProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
}> = ({ activeComponent, updateComponent }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Checkbox Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Checkbox Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.checkboxText || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { checkboxText: e.target.value })}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// Switch-specific properties
const SwitchProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
}> = ({ activeComponent, updateComponent }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Switch Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Switch Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.switchText || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { switchText: e.target.value })}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// Label-specific properties
const LabelProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
}> = ({ activeComponent, updateComponent }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Label Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Label Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.labelText || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { labelText: e.target.value })}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// Textarea-specific properties
const TextareaProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void,
}> = ({ activeComponent, updateComponent, updateComponentMeta }) => {
    const [show, setShow] = useState(true);

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                Textarea Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Placeholder Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.placeholder || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { placeholder: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Number of Rows</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.props?.textareaRows || 3}
                        onChange={(e) => updateComponent(activeComponent.id, { textareaRows: parseInt(e.target.value) || 3 })}
                    />
                </div>

                {/* Validation Options */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Validation</label>
                    <div className="space-y-3 border border-border rounded p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Min Length</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={activeComponent.validation?.minLength || ''}
                                    onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                        validation: { 
                                            ...activeComponent.validation, 
                                            minLength: e.target.value ? parseInt(e.target.value) : undefined 
                                        } 
                                    })}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Max Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={activeComponent.validation?.maxLength || ''}
                                    onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                        validation: { 
                                            ...activeComponent.validation, 
                                            maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                                        } 
                                    })}
                                    placeholder="∞"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">Custom Error Message</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                value={activeComponent.validation?.errorMessage || ''}
                                onChange={(e) => updateComponentMeta(activeComponent.id, { 
                                    validation: { 
                                        ...activeComponent.validation, 
                                        errorMessage: e.target.value || undefined 
                                    } 
                                })}
                                placeholder="Custom validation error message"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// MCQ-specific properties
const MCQProperties: React.FC<{
    activeComponent: FormComponent,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void,
}> = ({ activeComponent, updateComponent, updateComponentMeta }) => {
    const [show, setShow] = useState(true);
    const [newOption, setNewOption] = useState('');

    const addOption = () => {
        if (newOption.trim()) {
            const currentOptions = activeComponent.props?.options || ['Option A', 'Option B', 'Option C', 'Option D'];
            updateComponent(activeComponent.id, {
                options: [...currentOptions, newOption.trim()]
            });
            setNewOption('');
        }
    };

    const removeOption = (index: number) => {
        const currentOptions = activeComponent.props?.options || [];
        if (currentOptions.length > 2) { // Keep at least 2 options
            const newOptions = currentOptions.filter((_, i) => i !== index);
            updateComponent(activeComponent.id, { options: newOptions });
            
            // Update correct answers if needed
            const currentCorrectAnswers = activeComponent.quiz?.correctAnswers || [];
            const removedOption = currentOptions[index];
            const newCorrectAnswers = currentCorrectAnswers.filter(answer => answer !== removedOption);
            
            updateComponentMeta(activeComponent.id, {
                quiz: {
                    ...activeComponent.quiz,
                    correctAnswers: newCorrectAnswers
                }
            });
        }
    };

    const updateOption = (index: number, newValue: string) => {
        const currentOptions = activeComponent.props?.options || [];
        const oldValue = currentOptions[index];
        const newOptions = [...currentOptions];
        newOptions[index] = newValue;
        updateComponent(activeComponent.id, { options: newOptions });
        
        // Update correct answers if this option was marked as correct
        const currentCorrectAnswers = activeComponent.quiz?.correctAnswers || [];
        if (currentCorrectAnswers.includes(oldValue)) {
            const newCorrectAnswers = currentCorrectAnswers.map(answer => 
                answer === oldValue ? newValue : answer
            );
            updateComponentMeta(activeComponent.id, {
                quiz: {
                    ...activeComponent.quiz,
                    correctAnswers: newCorrectAnswers
                }
            });
        }
    };

    const toggleCorrectAnswer = (option: string) => {
        const currentCorrectAnswers = activeComponent.quiz?.correctAnswers || [];
        const isMultipleChoice = activeComponent.quiz?.isMultipleChoice || false;
        
        let newCorrectAnswers: string[];
        
        if (isMultipleChoice) {
            // Multiple choice: toggle the option
            newCorrectAnswers = currentCorrectAnswers.includes(option)
                ? currentCorrectAnswers.filter(answer => answer !== option)
                : [...currentCorrectAnswers, option];
        } else {
            // Single choice: set only this option
            newCorrectAnswers = currentCorrectAnswers.includes(option) ? [] : [option];
        }
        
        updateComponentMeta(activeComponent.id, {
            quiz: {
                ...activeComponent.quiz,
                correctAnswers: newCorrectAnswers
            }
        });
    };

    return (
        <div className='flex flex-col gap-4 p-4 border-b border-border'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-foreground flex justify-between items-center cursor-pointer w-full hover:text-muted-foreground transition-colors'>
                MCQ Properties
                <span className="text-sm text-muted-foreground">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                
                {/* Question Type */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Question Type</label>
                    <select
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.quiz?.isMultipleChoice ? 'multiple' : 'single'}
                        onChange={(e) => updateComponentMeta(activeComponent.id, { 
                            quiz: { 
                                ...activeComponent.quiz, 
                                isMultipleChoice: e.target.value === 'multiple',
                                correctAnswers: [] // Reset correct answers when changing type
                            } 
                        })}
                    >
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                    </select>
                </div>

                {/* Score */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Score Points</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        value={activeComponent.quiz?.score || 1}
                        onChange={(e) => updateComponentMeta(activeComponent.id, { 
                            quiz: { 
                                ...activeComponent.quiz, 
                                score: parseFloat(e.target.value) || 1 
                            } 
                        })}
                        placeholder="1"
                    />
                </div>

                {/* Options */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Answer Options</label>
                    <div className="space-y-2">
                        {(activeComponent.props?.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                />
                                <button
                                    onClick={() => toggleCorrectAnswer(option)}
                                    className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-colors ${
                                        (activeComponent.quiz?.correctAnswers || []).includes(option)
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-border hover:border-green-400'
                                    }`}
                                    title="Mark as correct answer"
                                >
                                    ✓
                                </button>
                                <button
                                    onClick={() => removeOption(index)}
                                    disabled={(activeComponent.props?.options || []).length <= 2}
                                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove option"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <input
                                type="text"
                                placeholder="+ Add new option"
                                className="flex-1 p-2 text-sm border border-dashed border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-solid"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addOption()}
                            />
                        </div>
                    </div>
                </div>

                {/* Correct Answers Display */}
                {(activeComponent.quiz?.correctAnswers || []).length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Correct Answer(s)</label>
                        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                            {(activeComponent.quiz?.correctAnswers || []).join(', ')}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Helper function to render field-specific properties
const renderFieldSpecificProperties = (
    activeComponent: FormComponent, 
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void
) => {
    switch (activeComponent.type) {
        case 'Input':
            return <InputProperties activeComponent={activeComponent} updateComponent={updateComponent} updateComponentMeta={updateComponentMeta} />;
        case 'Select':
            return <SelectProperties activeComponent={activeComponent} updateComponent={updateComponent} />;
        case 'Button':
            return <ButtonProperties activeComponent={activeComponent} updateComponent={updateComponent} />;
        case 'Checkbox':
            return <CheckboxProperties activeComponent={activeComponent} updateComponent={updateComponent} />;
        case 'Switch':
            return <SwitchProperties activeComponent={activeComponent} updateComponent={updateComponent} />;
        case 'Label':
            return <LabelProperties activeComponent={activeComponent} updateComponent={updateComponent} />;
        case 'Textarea':
            return <TextareaProperties activeComponent={activeComponent} updateComponent={updateComponent} updateComponentMeta={updateComponentMeta} />;
        case 'MCQ':
            return <MCQProperties activeComponent={activeComponent} updateComponent={updateComponent} updateComponentMeta={updateComponentMeta} />;
        default:
            return null;
    }
};

function PropertiesPanel() {
    const {
        steps,
        currentStepIndex,
        activeComponentId,
        updateComponent,
        updateComponentMeta,
        removeComponent,
        getCurrentStepComponents
    } = useFormStore();

    // Find the active component in the current step
    const components = getCurrentStepComponents();
    const activeComponent = components.find(c => c.id === activeComponentId);

    return (
        <div
            data-properties-panel // Add this identifier
            className=" border-l  w-2/6 min-w-[300px] border-gray-200 shadow-md bg-background flex flex-col space-y-6 overflow-y-auto max-h-screen
            sticky right-0 top-0 h-screen
            "
        >
            <div className="p-4">
                <FormProperties />
                {!activeComponent && <div className="text-center text-muted-foreground">
                    <p>Select a component to edit its properties</p>
                </div>}
                <CommonProperties
                    activeComponent={activeComponent}
                    updateComponent={updateComponent}
                    updateComponentMeta={updateComponentMeta}
                    removeComponent={removeComponent} />
                {activeComponent && renderFieldSpecificProperties(activeComponent, updateComponent, updateComponentMeta)}
                
                {/* Theme Customization - Show when no component is selected */}
                {!activeComponent && (
                    <div className="mt-6">
                        <ThemeCustomization formId={window.location.pathname.split('/').pop() || ''} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertiesPanel