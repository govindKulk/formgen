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
            className='flex flex-col gap-4'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-lg font-semibold flex justify-between items-center cursor-pointer w-full divide-y divide-primary/5 '>Form Properties
                <span>{show ? '▲' : '▼'}</span>

            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-2 overflow-hidden'
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
                    // value={formStore.title}
                    // onChange={(e) => formStore.setTitle(e.target.value)}
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
                <div>
                    <label htmlFor="primary-color" className="block text-sm font-medium mb-2">Primary Color</label>
                    <input
                        type="text"
                        id="primary-color"
                        className="w-full p-1 text-sm border rounded"
                    // value={formStore.submissionMessage}
                    // onChange={(e) => formStore.setSubmissionMessage(e.target.value)}
                    />
                </div>
            </motion.div>
        </div>
    )
}

const CommonProperties: React.FC<{
    activeComponent: FormComponent | undefined,
    updateComponent: (id: string, props: Partial<FormComponent['props']>) => void,
    removeComponent: (id: string) => void
}> = ({ activeComponent, updateComponent, removeComponent }) => {

    const [show, setShow] = useState(true);

    if (!activeComponent) {
        return;
    }

    return (
    <AnimatePresence >
        <motion.div
            key={activeComponent?.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-4'
        >

            <h2
                onClick={() => setShow(!show)}
                className='text-lg font-semibold flex justify-between items-center cursor-pointer w-full divide-y divide-primary/5 '>Common Properties
                <span>{show ? '▲' : '▼'}</span>

            </h2>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col gap-2 overflow-hidden'>
                <div>
                    <label className="text-sm font-medium mb-1 flex justify-between items-center">
                    Label

                    <span
                    className='cursor-pointer '
                    onClick={() => {
                        activeComponent.showLabel = !activeComponent.showLabel;
                        updateComponent(activeComponent.id, activeComponent.props);
                    }}
                    >
                        {activeComponent.showLabel ?  <Eye className="w-4 h-4 text-gray-500" /> :
                            <EyeClosed className="w-4 h-4 text-gray-500" />}
                    </span>
                </label>
                <input
                    type="text"
                    disabled={!activeComponent.showLabel}
                    className="w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={!activeComponent.showLabel ? 'None' : activeComponent.props?.label || ''}
                    onChange={(e) => {
                        activeComponent.props.label = e.target.value;
                        updateComponent(activeComponent.id, activeComponent.props);
                    }}
                />
            </div>

            <div>
                {/* delete the field */}
                <div
                    className='flex items-center gap-2 cursor-pointer'
                >
                    <Trash
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this component?")) {
                                removeComponent(activeComponent.id);
                            }
                        }}
                    />
                    <div className="text-sm text-gray-600">Delete Component</div>
                </div>
            </div>
            {/* Add more property fields as needed */}
        </motion.div>
    </motion.div>
    </AnimatePresence>
    )
}

function PropertiesPanel() {
    const {
        components,
        activeComponentId,
        updateComponent,
        removeComponent
    } = useFormStore();

    // Find the active component
    const activeComponent = components.find(c => c.id === activeComponentId);

    return (
        <div
            data-properties-panel // Add this identifier
            className="w-1/5 border-l border-gray-200 p-4 shadow-md divide-y divide-primary flex flex-col space-y-4"
        >


            <FormProperties />
            {!activeComponent && <div className="text-center text-gray-500">
                <p>Select a component to edit its properties</p>
            </div>}
            <CommonProperties
                activeComponent={activeComponent}
                updateComponent={updateComponent}
                removeComponent={removeComponent} />
        </div>
    )
}

export default PropertiesPanel