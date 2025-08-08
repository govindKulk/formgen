"use client";

import { FormComponent, useFormStore } from '@/store/form'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Eye, EyeClosed, Trash } from 'lucide-react';

const FormProperties: React.FC = () => {

    const formStore = useFormStore();
    const [show, setShow] = useState(true);

    return (
        <div
            className='flex flex-col gap-4 p-4 border-b border-gray-100'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Form Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>

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
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                        <span className="text-sm text-gray-700">
                            Step {formStore.currentStepIndex + 1} of {formStore.steps.length}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formStore.steps[formStore.currentStepIndex]?.stepTitle}
                        </span>
                    </div>
                    
                    {/* Step Navigation Buttons */}
                    {formStore.steps.length > 1 && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => formStore.setCurrentStep(Math.max(0, formStore.currentStepIndex - 1))}
                                disabled={formStore.currentStepIndex === 0}
                                className="flex-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => formStore.setCurrentStep(Math.min(formStore.steps.length - 1, formStore.currentStepIndex + 1))}
                                disabled={formStore.currentStepIndex === formStore.steps.length - 1}
                                className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
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
                        value={formStore.primaryColor}
                        onChange={(e) => formStore.setPrimaryColor(e.target.value)}
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
            className='flex flex-col gap-4 p-4 border-b border-gray-100'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Common Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>

            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                
                {/* Required Field Toggle */}
                {['Input', 'Textarea', 'Select', 'Checkbox'].includes(activeComponent.type) && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <input
                                type="checkbox"
                                checked={activeComponent.required || false}
                                onChange={(e) => updateComponentMeta(activeComponent.id, { required: e.target.checked })}
                                className="rounded border-gray-300"
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
                        {activeComponent.showLabel ?  <Eye className="w-4 h-4 text-gray-500" /> :
                            <EyeClosed className="w-4 h-4 text-gray-500" />}
                    </span>
                </label>
                <input
                    type="text"
                    disabled={!activeComponent.showLabel}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Input Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                
                {/* Input Type Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Input Type</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium mb-2 text-gray-700">Placeholder Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activeComponent.props?.placeholder || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { placeholder: e.target.value })}
                    />
                </div>

                {/* Validation Options */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Validation</label>
                    <div className="space-y-3 border border-gray-200 rounded p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-600">Min Length</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                <label className="block text-xs font-medium mb-1 text-gray-600">Max Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            <label className="block text-xs font-medium mb-1 text-gray-600">Custom Pattern (RegEx)</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            <label className="block text-xs font-medium mb-1 text-gray-600">Custom Error Message</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Select Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Options</label>
                    <div className="space-y-2">
                        {(activeComponent.props?.options || []).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <input
                                type="text"
                                placeholder="+ Add new option"
                                className="flex-1 p-2 text-sm border border-dashed border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-solid"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Button Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Button Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Checkbox Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Checkbox Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Switch Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Switch Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Label Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Label Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className='flex flex-col gap-4 p-4 border-b border-gray-100'>
            <h2
                onClick={() => setShow(!show)}
                className='text-base font-semibold text-gray-900 flex justify-between items-center cursor-pointer w-full hover:text-gray-700 transition-colors'>
                Textarea Properties
                <span className="text-sm text-gray-500">{show ? '▲' : '▼'}</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-3 overflow-hidden'>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Placeholder Text</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activeComponent.props?.placeholder || ''}
                        onChange={(e) => updateComponent(activeComponent.id, { placeholder: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Number of Rows</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activeComponent.props?.textareaRows || 3}
                        onChange={(e) => updateComponent(activeComponent.id, { textareaRows: parseInt(e.target.value) || 3 })}
                    />
                </div>

                {/* Validation Options */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Validation</label>
                    <div className="space-y-3 border border-gray-200 rounded p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-600">Min Length</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                <label className="block text-xs font-medium mb-1 text-gray-600">Max Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            <label className="block text-xs font-medium mb-1 text-gray-600">Custom Error Message</label>
                            <input
                                type="text"
                                className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="w-1/4 border-l border-gray-200 p-4 shadow-md bg-white flex flex-col space-y-6"
        >


            <FormProperties />
            {!activeComponent && <div className="text-center text-gray-500">
                <p>Select a component to edit its properties</p>
            </div>}
            <CommonProperties
                activeComponent={activeComponent}
                updateComponent={updateComponent}
                updateComponentMeta={updateComponentMeta}
                removeComponent={removeComponent} />
            {activeComponent && renderFieldSpecificProperties(activeComponent, updateComponent, updateComponentMeta)}
        </div>
    )
}

export default PropertiesPanel