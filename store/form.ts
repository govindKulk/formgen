import {create} from 'zustand';
import {nanoid} from 'nanoid';
import { Component } from 'lucide-react';


export type FormComponentType = 'Input' | 'Button' | 'Checkbox' | 'Textarea' | 'Select' | 'Switch' | 'Label' | 'Dialog' | 'Tooltip' | 'MCQ';


export interface FormStep {
  id: string;
  stepTitle?: string;
  components: FormComponent[];
}

export interface FormComponent {
    id: string;
    showLabel?: boolean;
    type: 'Input' | 'Textarea' | 'Button' | 'Checkbox' | 'Select' | 'Switch' | 'Label' | 'Card' | 'Dialog' | 'Tooltip' | 'MCQ';
    required?: boolean;
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        errorMessage?: string;
    };
    quiz?: {
        isMultipleChoice?: boolean;
        correctAnswers?: string[];
        score?: number;
    };
    props: {
        label?: string;
        placeholder?: string;
        options?: string[];
        checked?: boolean;
        value?: string;
        buttonText?: string;
        checkboxText?: string;
        switchText?: string;
        labelText?: string;
        textareaRows?: number;
        inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    }
}



// Define the state and actions for your store
interface FormStore {
  steps: FormStep[];
  currentStepIndex: number;
  title: string;
  primaryColor: string;
  backgroundColor: string;
  brandLogo?: string;
  showPoweredBy: boolean;
  // Form settings
  isPublished: boolean;
  allowAnonymous: boolean;
  allowDuplicates: boolean;
  activeComponentId?: string;
  submissionMessage: string;
  formData: Record<string, any>;
  currentStepValid: boolean;
  setSubmissionMessage: (message: string) => void;
  setTitle: (title: string) => void;
  setStepTitle: (stepTitle: string, currentStepIndex: number) => void,
  setPrimaryColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBrandLogo: (logo?: string) => void;
  setShowPoweredBy: (show: boolean) => void;
  // Form settings actions
  setIsPublished: (published: boolean) => void;
  setAllowAnonymous: (allow: boolean) => void;
  setAllowDuplicates: (allow: boolean) => void;
  setActiveComponentId: (id?: string) => void;
  addComponent: (index: number, type: FormComponentType) => void;
  removeComponent: (id: string) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  updateComponent: (id: string, props: Partial<FormComponent['props']>) => void;
  updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void;
  reorderComponents: (newOrder: FormComponent[]) => void;
  addStep: () => void;
  removeStep: (stepId: string) => void;
  setCurrentStep: (index: number) => void;
  updateStepTitle: (stepId: string, title: string) => void;
  setFormData: (data: Record<string, any>) => void;
  updateFormField: (fieldName: string, value: any) => void;
  setCurrentStepValidation: (isValid: boolean) => void;
  canNavigateToNextStep: () => boolean;
  canNavigateToPrevStep: () => boolean;
  getRequiredFieldsForCurrentStep: () => FormComponent[];
  // Helper getter for current step components
  getCurrentStepComponents: () => FormComponent[];
  // Load complete form state (for loading from database)
  loadFormState: (state: Partial<FormStore>) => void;
  // Reset form data for public forms
  resetFormData: () => void;
  getAllComponents: () => FormComponent[];
}

export const useFormStore = create<FormStore>((set, get) => ({
  
  steps: [
    {
      id: nanoid(),
      stepTitle: "First Step",
      components: [],
     
    }
  ],
  currentStepIndex: 0,
  title: 'My Form',
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  brandLogo: undefined,
  showPoweredBy: true,
  // Form settings
  isPublished: false,
  allowAnonymous: true,
  allowDuplicates: true,
  activeComponentId: undefined,
  submissionMessage: 'Form submitted successfully!',
  formData: {},
  currentStepValid: true,

  setSubmissionMessage: (message) => set({ submissionMessage: message }),
  setActiveComponentId: (id) => set({ activeComponentId: id }),
  setTitle: (title) => set({ title }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBrandLogo: (logo) => set({ brandLogo: logo }),
  setShowPoweredBy: (show) => set({ showPoweredBy: show }),
  // Form settings actions
  setIsPublished: (published) => set({ isPublished: published }),
  setAllowAnonymous: (allow) => set({ allowAnonymous: allow }),
  setAllowDuplicates: (allow) => set({ allowDuplicates: allow }),

  // Form data management
  setFormData: (data) => set({ formData: data }),
  updateFormField: (fieldName, value) => {
    set((state) => ({
      formData: { ...state.formData, [fieldName]: value }
    }));
  },
  setCurrentStepValidation: (isValid) => set({ currentStepValid: isValid }),

  // Navigation validation
  canNavigateToNextStep: () => {
    const state = get();
    const requiredFields = state.getRequiredFieldsForCurrentStep();
    const isSelected =  requiredFields.every(component => {
      const fieldValue = state.formData[component.id];
      if (component.type === 'Checkbox') {
        return !component.required || fieldValue === true;
      }
      return !component.required || (fieldValue !== undefined && fieldValue !== null && fieldValue !== '');
    });

    // Include React Hook Form validation state
    return isSelected && state.currentStepValid;
  },

  canNavigateToPrevStep: () => {
    const state = get();
    return state.currentStepIndex > 0;
  },

  getRequiredFieldsForCurrentStep: () => {
    const state = get();
    const currentComponents = state.getCurrentStepComponents();
    return currentComponents.filter(component => 
      component.required && 
      ['Input', 'Textarea', 'Select', 'Checkbox'].includes(component.type)
    );
  },

  // Helper getter for current step components
  getCurrentStepComponents: () => {
    const state = get();
    return state.steps[state.currentStepIndex]?.components || [];
  },

  setStepTitle: (stepTitle: string, currentStepIndex: number) => {
        const {steps: formSteps} = get();
        formSteps[currentStepIndex].stepTitle = stepTitle;
        set({steps: formSteps});
  },

  // Adds a new component to the current step at a specific index
  addComponent: (index, type) => {

    const sameTypeLabels = get().getAllComponents().filter(c => c.type === type);
    const newComponent: FormComponent = {
      id: nanoid(),
      type: type,
      showLabel: type !== 'Label',
      required: false,
      validation: {},
      quiz: type === 'MCQ' ? {
        isMultipleChoice: false,
        correctAnswers: [],
        score: 1
      } : undefined,
      props: {
        label: `New ${type + ' ' + sameTypeLabels.length}`,
        placeholder: type === 'Input' ? `Enter ${type.toLowerCase()}...` : undefined,
        buttonText: type === 'Button' ? 'Click me' : undefined,
        checkboxText: type === 'Checkbox' ? 'Check me' : undefined,
        switchText: type === 'Switch' ? 'Toggle me' : undefined,
        labelText: type === 'Label' ? 'Label text' : undefined,
        textareaRows: type === 'Textarea' ? 3 : undefined,
        options: (type === 'Select') ? ['Option 1', 'Option 2'] : 
                 (type === 'MCQ') ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
        inputType: type === 'Input' ? 'text' : undefined,
      },
    };
    set((state) => {
      const newSteps = [...state.steps];
      const currentStep = { ...newSteps[state.currentStepIndex] };
      const newComponents = [...currentStep.components];
      newComponents.splice(index, 0, newComponent);
      currentStep.components = newComponents;
      newSteps[state.currentStepIndex] = currentStep;
      return { steps: newSteps };
    });
  },

  // Removes a component from the current step
  removeComponent: (id) => {
    set((state) => {
      const newSteps = [...state.steps];
      const currentStep = { ...newSteps[state.currentStepIndex] };
      currentStep.components = currentStep.components.filter((c) => c.id !== id);
      newSteps[state.currentStepIndex] = currentStep;
      return { steps: newSteps };
    });
  },

  // Moves a component within the current step
  moveComponent: (dragIndex, hoverIndex) => {
    set((state) => {
      const currentStep = state.steps[state.currentStepIndex];
      if (dragIndex < 0 || hoverIndex < 0 || 
          dragIndex >= currentStep.components.length || 
          hoverIndex >= currentStep.components.length ||
          dragIndex === hoverIndex) {
        return state;
      }

      const newSteps = [...state.steps];
      const newCurrentStep = { ...currentStep };
      const newComponents = [...newCurrentStep.components];
      const [removed] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, removed);
      newCurrentStep.components = newComponents;
      newSteps[state.currentStepIndex] = newCurrentStep;
      return { steps: newSteps };
    });
  },

  // Updates component properties in the current step
  updateComponent: (id, newProps) => {
    set((state) => {
      const newSteps = [...state.steps];
      const currentStep = { ...newSteps[state.currentStepIndex] };
      currentStep.components = currentStep.components.map((component) =>
        component.id === id
          ? { ...component, props: { ...component.props, ...newProps } }
          : component
      );
      newSteps[state.currentStepIndex] = currentStep;
      return { steps: newSteps };
    });
  },

  // Updates component metadata in the current step
  updateComponentMeta: (id, newMeta) => {
    set((state) => {
      const newSteps = [...state.steps];
      const currentStep = { ...newSteps[state.currentStepIndex] };
      currentStep.components = currentStep.components.map((component) =>
        component.id === id
          ? { ...component, ...newMeta }
          : component
      );
      newSteps[state.currentStepIndex] = currentStep;
      return { steps: newSteps };
    });
  },

  // Reorder components in the current step
  reorderComponents: (newOrder) => {
    set((state) => {
      const newSteps = [...state.steps];
      const currentStep = { ...newSteps[state.currentStepIndex] };
      currentStep.components = newOrder;
      newSteps[state.currentStepIndex] = currentStep;
      return { steps: newSteps };
    });
  },

  // Add a new step
  addStep: () => {
    set((state) => {
      const newStep: FormStep = {
        id: nanoid(),
        stepTitle: `Step ${state.steps.length + 1}`,
        components: []
      };
      return { 
        steps: [...state.steps, newStep],
        currentStepIndex: state.steps.length // Navigate to the new step
      };
    });
  },

  // Remove a step
  removeStep: (stepId) => {
    set((state) => {
      const newSteps = state.steps.filter(step => step.id !== stepId);
      if (newSteps.length === 0) {
        // Always keep at least one step
        return {
          steps: [{
            id: nanoid(),
            title: 'Step 1',
            components: []
          }],
          currentStepIndex: 0
        };
      }
      const newCurrentIndex = Math.min(state.currentStepIndex, newSteps.length - 1);
      return { 
        steps: newSteps,
        currentStepIndex: newCurrentIndex
      };
    });
  },

  // Set current step
  setCurrentStep: (index) => {
    set((state) => ({
      currentStepIndex: Math.max(0, Math.min(index, state.steps.length - 1))
    }));
  },

  // Update step title
  updateStepTitle: (stepId, title) => {
    set((state) => ({
      steps: state.steps.map(step =>
        step.id === stepId ? { ...step, title } : step
      )
    }));
  },

  // Load complete form state from database
  loadFormState: (newState) => {
    set((state) => ({
      ...state,
      ...newState,
      // Reset formData when loading a new form to avoid contamination
      formData: newState.formData || {},
    }));
  },

  // Reset form data for public forms
  resetFormData: () => {
    set({ formData: {} });
  },

  getAllComponents: () => {
    return get().steps.flatMap(step => step.components);
  }
}));