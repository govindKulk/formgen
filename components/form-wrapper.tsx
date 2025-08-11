"use client";

import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStore, FormComponent } from '@/store/form';
import { FormNavigation } from './form-navigation';

// Helper function to create Zod schema from form components
function createZodSchema(components: FormComponent[]): z.ZodObject<any> {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  components.forEach((component) => {
    if (['Input', 'Textarea', 'Select', 'Checkbox'].includes(component.type)) {
      let fieldSchema: z.ZodString | z.ZodBoolean;

      switch (component.type) {
        case 'Input':
          if (component.props.inputType === 'email') {
            fieldSchema = z.string().email('Please enter a valid email address');
            fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), 'Invalid email format');
          } else if (component.props.inputType === 'number') {
            fieldSchema = z.string().regex(/^\d+$/, 'Please enter a valid number');
          } else if (component.props.inputType === 'url') {
            fieldSchema = z.string().email('Please enter a valid URL');
          } else {
            fieldSchema = z.string();
          }

          // Apply validation rules
          if (component.validation?.minLength) {
            fieldSchema = (fieldSchema as z.ZodString).min(component.validation.minLength, 
              component.validation.errorMessage || `Minimum ${component.validation.minLength} characters required`);
          }
          if (component.validation?.maxLength) {
            fieldSchema = (fieldSchema as z.ZodString).max(component.validation.maxLength, 
              component.validation.errorMessage || `Maximum ${component.validation.maxLength} characters allowed`);
          }
          if (component.validation?.pattern) {
            fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(component.validation.pattern), 
              component.validation.errorMessage || 'Invalid format');
          }
          break;

        case 'Textarea':
          fieldSchema = z.string();
          if (component.validation?.minLength) {
            fieldSchema = fieldSchema.min(component.validation.minLength, 
              component.validation.errorMessage || `Minimum ${component.validation.minLength} characters required`);
          }
          if (component.validation?.maxLength) {
            fieldSchema = fieldSchema.max(component.validation.maxLength, 
              component.validation.errorMessage || `Maximum ${component.validation.maxLength} characters allowed`);
          }
          break;

        case 'Select':
          fieldSchema = z.string().min(1, 'Please select an option');
          break;

        case 'Checkbox':
          fieldSchema = z.boolean();
          if (component.required) {
            fieldSchema = fieldSchema.refine((val: boolean) => val === true, {
              message: 'This field is required',
            });
          }
          break;

        default:
          fieldSchema = z.string();
      }

      // Make field optional if not required
      if (!component.required && component.type !== 'Checkbox') {
        schemaFields[component.id] = (fieldSchema as z.ZodString).optional().or(z.literal(''));
      } else if (!component.required && component.type === 'Checkbox') {
        schemaFields[component.id] = (fieldSchema as z.ZodBoolean).optional();
      } else {
        schemaFields[component.id] = fieldSchema;
      }
    }
  });

  return z.object(schemaFields);
}

interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit?: (data: any) => void;
  className?: string;
}

export function FormWrapper({ children, onSubmit, className = "" }: FormWrapperProps) {
  // Use selective subscription to avoid re-renders when formData changes
  const steps = useFormStore((state) => state.steps);
  const currentStepIndex = useFormStore((state) => state.currentStepIndex);
  const getCurrentStepComponents = useFormStore((state) => state.getCurrentStepComponents);
  // NOTE: Deliberately NOT subscribing to formData to avoid re-renders
  
  // Get formData only once on initial render, then manage it independently
  const [initialFormData] = React.useState(() => useFormStore.getState().formData);

  // Get current step components for validation
  const currentStepComponents = getCurrentStepComponents();

  // Create Zod schema for current step
  const currentStepSchema = useMemo(() => {
    return createZodSchema(currentStepComponents);
  }, [currentStepComponents]);

  // Initialize form with React Hook Form
  const methods = useForm({
    resolver: zodResolver(currentStepSchema),
    defaultValues: initialFormData,
    mode: 'onChange', // Keep onChange for real-time validation
  });

  const { handleSubmit, watch, formState: { errors, isValid }, setValue } = methods;

  // Make validation state available to the store for navigation decisions
  const hasValidationErrors = Object.keys(errors).length > 0;
  
  // Update store with current validation state for navigation decisions
  React.useEffect(() => {
    useFormStore.getState().setCurrentStepValidation(!hasValidationErrors && isValid);
  }, [hasValidationErrors, isValid]);

  // Only update individual field values when switching steps
  // Track previous step to avoid unnecessary updates
  const prevStepRef = React.useRef(currentStepIndex);
  
  // updates the react hook form values when the step changes from the form store.
  React.useEffect(() => {
    // Only update form values when step actually changes
    if (prevStepRef.current !== currentStepIndex) {
      // Get fresh formData from store when step changes (no subscription needed)
      const currentFormData = useFormStore.getState().formData;
      Object.keys(currentFormData).forEach(fieldName => {
        setValue(fieldName, currentFormData[fieldName], { shouldValidate: false });
      });
      prevStepRef.current = currentStepIndex;
    }
  }, [currentStepIndex, setValue]); // No formData dependency
  
  // Only sync form data to store when moving between steps or on form submission
  // This completely eliminates the circular dependency issue
  const watchedValues = watch();

  console.log("watchedValues:", watchedValues);
  
  // Store the current form values when navigating steps
  const syncFormDataToStore = React.useCallback(() => {
    const currentValues = watch(); // Get current values directly when called
    console.log('Syncing form data to store:', currentValues);
    Object.keys(currentValues).forEach(fieldName => {
      if (currentValues[fieldName] !== undefined) {
        useFormStore.getState().updateFormField(fieldName, currentValues[fieldName]);
      }
    });
    return currentValues; // Return the synced values
  }, [watch]); // Only depend on watch function

  // Real-time sync of form data with debouncing for better UX
  // This ensures navigation buttons update immediately when required fields are filled
  const timeOutRef = React.useRef<NodeJS.Timeout | null>(null);
  const prevWatchedValuesRef = React.useRef(watchedValues);
  

  // effect to update the form store with watched values in every 500ms .
  React.useEffect(() => {
    // Only proceed if values actually changed
    const hasChanged = JSON.stringify(prevWatchedValuesRef.current) !== JSON.stringify(watchedValues);
    if (!hasChanged) return;
    
    // Clear existing timeout
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
 
    // Set new timeout with current values captured in closure
    timeOutRef.current = setTimeout(() => {
      const currentValues = watchedValues;
      Object.keys(currentValues).forEach(fieldName => {
        if (currentValues[fieldName] !== undefined) {
          useFormStore.getState().updateFormField(fieldName, currentValues[fieldName]);
        }
      });
    }, 500); // Reasonable delay to avoid excessive calls

    // Update ref
    prevWatchedValuesRef.current = watchedValues;

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [watchedValues]); // Keep dependency but break cycle with captured values

  const onFormSubmit = (data: any) => {
    // Sync current step data to store before submission and get the synced values
    const currentStepData = syncFormDataToStore();
    
    // Get all form data from store after syncing
    const allFormData = useFormStore.getState().formData;
    
    // Transform the data to use meaningful field names instead of component IDs
    const transformedData: Record<string, any> = {};
    const allComponents = steps.flatMap(step => step.components);
    
    Object.keys(allFormData).forEach(componentId => {
      const component = allComponents.find(comp => comp.id === componentId);
      if (component) {
        // Use label as field name, or fallback to a cleaned version of the label
        const fieldName = component.props.label 
          ? component.props.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
          : componentId;
        transformedData[fieldName] = allFormData[componentId];
      } else {
        // If component not found, use original ID
        transformedData[componentId] = allFormData[componentId];
      }
    });
    
    console.log('Complete form data for submission (with meaningful names):', transformedData);
    console.log('Original data (with component IDs):', allFormData);
    console.log('RHF data (current step only):', data);
    console.log('Current step data just synced:', currentStepData);
    
    const isLastStep = currentStepIndex === steps.length - 1;
    
    if (isLastStep) {
      console.log("submittin from formwrapper");
      // Final submission - use transformed data with meaningful field names
      onSubmit?.(transformedData);
    }
    // If not last step, navigation is handled by FormNavigation component
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className={className}>
        {children}
        <FormNavigation 
          onNext={syncFormDataToStore}
          onPrev={syncFormDataToStore}
          className="mt-6"
        />
      </form>
    </FormProvider>
  );
}

// Export helper hook for accessing form context in child components
export function useFormContext() {
  const context = React.useContext(FormProvider as any);
  if (!context) {
    throw new Error('useFormContext must be used within FormWrapper');
  }
  return context;
}
