"use client"
import PublicForm from '@/components/public-form';
import { useFormApi } from '@/hooks/use-form-api'
import { useFormStore } from '@/store/form';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';

function PublicFormPage() {

    const [error, setError] = useState<string | null>(null);
    const [formLoaded, setFormLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

    const {submissionMessage} = useFormStore();
    
    const {
        loadPublicForm,
        isLoading,
        submitResponse,
        isSaving
    } = useFormApi({
        onSuccess: (message) => {
            console.log('Success:', message);
            if (message.includes('submitted')) {
                setSubmissionSuccess(true);
            } else {
                setFormLoaded(true);
            }
        }, 
        onError: (error) => {
            console.error('Error:', error);
            setError(error);
        }
    });

    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setFormLoaded(false);
            
            try {
                await loadPublicForm(id as string);
                // Success is handled in onSuccess callback
            } catch (err) {
                // Error is handled in onError callback
                console.error('Failed to load public form:', err);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    // Show submission success page
    if (submissionSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="max-w-lg mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
                        <p className="text-gray-600">{
                            submissionMessage || "Your form has been submitted successfully"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
            {(loading || isLoading) ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <ClipLoader size={50} color="#3b82f6" />
                    <p className="mt-4 text-gray-600">Loading form...</p>
                </div>
            ) : (   
                <>
                    {error && (
                        <div className="max-w-lg mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-red-700 font-medium">Error loading form</div>
                            <div className="text-red-600 text-sm mt-1">{error}</div>
                        </div>
                    )}
                    {formLoaded && !error && (
                        <div className="w-full relative">
                            <PublicForm submitResponse={submitResponse} />
                            {isSaving && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                    <div className="flex flex-col items-center">
                                        <ClipLoader size={30} color="#3b82f6" />
                                        <p className="mt-2 text-gray-600">Submitting...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!formLoaded && !error && (
                        <div className="max-w-lg mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-yellow-700">Form not found or not published</div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default PublicFormPage