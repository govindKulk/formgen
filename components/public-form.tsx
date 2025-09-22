import React, { useState } from 'react'
import { FormWrapper } from './form-wrapper'
import PublicFormContent from './public-form-content'
import { useFormStore } from '@/store/form'
import { useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import SubmissionSuccess from './submission-success';

function PublicForm({
    submitResponse,
    isPreviewMode
}: {
    submitResponse?: (formId: string, responseData: any) => Promise<void>
    isPreviewMode: boolean
}) {

    const {
        title,
        currentStepIndex,
        steps,
        submissionMessage,
        theme
    } = useFormStore();

    const { id: formShareUrl } = useParams();
    const currentStep = steps[currentStepIndex];
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);

    if(showSuccessScreen) {
        return <SubmissionSuccess submissionMessage={"This is the form submission screen."} />
    }
    // Debug logging
    console.log('PublicForm render:', {
        title,
        currentStepIndex,
        stepsLength: steps.length,
        currentStep,
        hasComponents: currentStep?.components?.length > 0,
        formShareUrl
    });

    if (!currentStep) {
        return (
            <div className="max-w-lg mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-700">No form content available</div>
            </div>
        );
    }

    const handleFormSubmit = async (formData: Record<string, any>) => {
        console.log('Form submission triggered with data:', formData);
        if(isPreviewMode) {
            setShowSuccessScreen(true);
            return;
        }
        if (!submitResponse || !formShareUrl) {
            console.error('Missing submitResponse function or form ID');
            toast.error('Error: Unable to submit form. Missing required data.');
            return;
        }



        try {
            await submitResponse(formShareUrl as string, formData);

            // Show success message
            toast.success(submissionMessage || 'Form submitted successfully!');

            // Optionally reset form or redirect
            // You could add logic here to show a success page or reset the form

        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Error submitting form. Please try again.');
        }
    };

    console.log(`currentStepIndex ${currentStepIndex}, steps length: ${steps.length}`);
    return (
        <FormWrapper
            onSubmit={handleFormSubmit}
            className="w-[90%] md:w-full max-w-lg mx-auto"
        >
            <main
                className={`p-8  rounded-lg border-2 bg-white max-w-lg mx-auto h-fit min-h-[600px] relative`}

                style={{
                backgroundColor: theme.backgroundColor || '#ffffff',
                color: theme.textColor || '#000000'
            }}
            >
                <PublicFormContent
                    title={title}
                    currentStep={currentStep}
                    currentStepIndex={currentStepIndex}
                    steps={steps}
                    brandLogo={theme.brandLogo}
                    primaryColor={theme.primaryColor}
                    backgroundColor={theme.backgroundColor}
                    showPoweredBy={theme.showPoweredBy}
                    components={currentStep.components || []}
                />
                {theme.showPoweredBy && (
                    <div className="absolute w-full text-center bottom-4 right-4 text-xs text-gray-500
                    flex items-center gap-2 justify-center font-bold
                    ">
                        Powered by <Link href="/" className="text-blue-600 hover:underline">
                            <Image src={"/Logo.svg"} alt="FormGen Logo" width={75} height={18} />
                        </Link>
                    </div>
                )}
            </main>
        </FormWrapper>
    )
}

export default PublicForm