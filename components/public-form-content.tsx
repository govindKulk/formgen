import { renderComponent } from "@/lib/helper";
import { FormComponent, FormStep } from "@/store/form";
import Image from "next/image";
import React from "react";

interface FormContentProps {
    title: string;
    currentStep: FormStep;
    currentStepIndex: number;
    steps: FormStep[];
    components: FormComponent[];
    brandLogo?: string;
    primaryColor?: string;
    backgroundColor?: string;
    showPoweredBy?: boolean;
}


const PublicFormContent = ({
    title,
    currentStep,
    currentStepIndex,
    steps,
    components,
    brandLogo,
    primaryColor,
    backgroundColor,
    showPoweredBy
}: FormContentProps) => {

    // Debug logging
    console.log('PublicFormContent render:', {
        title,
        currentStep,
        currentStepIndex,
        stepsLength: steps.length,
        componentsLength: components.length,
        components
    });


    return (
        <div
        className="
        "

   

        >
            <div
           
            >
                <div className="flex flex-col md:flex-row justify-between items-center  mb-4">
                    <div
                    className="order-2 md:order-1"
                    >
                        <h2 className=" text-2xl py-2 font-semibold" style={{
                            color: primaryColor || '#000000',
                        }}>
                            {title || 'Untitled Form'}
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4"
                        
                        >
                            {currentStep?.stepTitle || 'Step'} ({currentStepIndex + 1} of {steps.length})
                        </p>
                    </div>
                    <div
                    className="p-4 md:p-0 md:order-2"
                    >
                        {brandLogo && (
                        <Image 
                            src={brandLogo}
                            alt="Brand Logo"
                            width={200}
                            height={100}
                            className="rounded-full" 
                        />
                    )}
                    </div>
                </div>
            </div>

            {/* If there are components, map over them and render them */}
            {components.length > 0 ? (
                <div className="">
                    {components.map((component: FormComponent, index: number) => (
                        <React.Fragment key={component.id}>
                            <div className="mb-4 py-2 px-2">
                                {renderComponent(component, true)}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-600">No form components found</p>
                </div>
            )}
        </div>
    );
};

export default PublicFormContent;