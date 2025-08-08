"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormStore } from '@/store/form';

interface StepNavigationProps {
  className?: string;
}

export function StepNavigation({ className = "" }: StepNavigationProps) {
  const { steps, currentStepIndex, setCurrentStep } = useFormStore();

  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentStep(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(currentStepIndex + 1);
    }
  };

  // Don't show navigation if there's only one step
  if (steps.length <= 1) {
    return null;
  }

  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      {/* Back Button */}
      <motion.button
        onClick={handlePrevious}
        disabled={!canGoBack}
        whileHover={canGoBack ? { scale: 1.05 } : {}}
        whileTap={canGoBack ? { scale: 0.95 } : {}}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${canGoBack 
            ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all cursor-pointer
              ${index === currentStepIndex 
                ? 'bg-blue-600 w-8' 
                : index < currentStepIndex 
                  ? 'bg-blue-400' 
                  : 'bg-gray-300'
              }
            `}
            onClick={() => setCurrentStep(index)}
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 1 }}
          />
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={handleNext}
        disabled={!canGoNext}
        whileHover={canGoNext ? { scale: 1.05 } : {}}
        whileTap={canGoNext ? { scale: 0.95 } : {}}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${canGoNext 
            ? 'text-white bg-blue-600 hover:bg-blue-700 cursor-pointer' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
