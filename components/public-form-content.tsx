import { renderComponent } from "@/lib/helper";
import { FormComponent, FormStep } from "@/store/form";
import React from "react";

 interface FormContentProps {
   title: string;
   currentStep: FormStep;
   currentStepIndex: number;
   steps: FormStep[];
   components: FormComponent[];
 }
 
 
 const PublicFormContent = ({
   title,
   currentStep,
   currentStepIndex,
   steps,
   components
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
        <>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl py-2 font-semibold">
                            {title || 'Untitled Form'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {currentStep?.stepTitle || 'Step'} ({currentStepIndex + 1} of {steps.length})
                        </p>
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
        </>
    );
};

export default PublicFormContent;