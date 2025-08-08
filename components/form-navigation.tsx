"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/form';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

export function FormNavigation({ onNext, onPrev, className = "" }: FormNavigationProps) {
  const { 
    currentStepIndex, 
    steps, 
    setCurrentStep, 
    canNavigateToNextStep, 
    canNavigateToPrevStep 
  } = useFormStore();

  const handleNext = () => {
    if (canNavigateToNextStep()) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStep(currentStepIndex + 1);
      }
      onNext?.();
    }
  };

  const handlePrev = () => {
    if (canNavigateToPrevStep()) {
      setCurrentStep(currentStepIndex - 1);
      onPrev?.();
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className={`flex justify-between items-center mt-8 ${className}`}>
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handlePrev}
        disabled={!canNavigateToPrevStep()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStepIndex
                ? 'bg-primary'
                : index < currentStepIndex
                ? 'bg-primary/60'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Next/Submit Button */}
      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : handleNext}
        disabled={!canNavigateToNextStep()}
        className="flex items-center gap-2"
      >
        {isLastStep ? 'Submit' : 'Next'}
        {!isLastStep && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
}
