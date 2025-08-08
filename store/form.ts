import {create} from 'zustand';
import {nanoid} from 'nanoid';


export type FormComponentType = 'Input' | 'Button' | 'Checkbox' | 'Textarea' | 'Select' | 'Switch' | 'Label' | 'Dialog' | 'Tooltip';


export interface FormStep {
  id: string;
  stepTitle?: string;
  components: FormComponent[];
}

export interface FormComponent {
    id: string;
    showLabel?: boolean;
    type: 'Input' | 'Textarea' | 'Button' | 'Checkbox' | 'Select' | 'Switch' | 'Label' | 'Card' | 'Dialog' | 'Tooltip';
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
    }
}



// Define the state and actions for your store
interface FormStore {
  steps: FormStep[];
  currentStepIndex: number;
  title: string;
  primaryColor: string;
  activeComponentId?: string;
  submissionMessage: string;
  setSubmissionMessage: (message: string) => void;
  setTitle: (title: string) => void;
  setStepTitle: (stepTitle: string, currentStepIndex: number) => void,
  setPrimaryColor: (color: string) => void;
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
  // Helper getter for current step components
  getCurrentStepComponents: () => FormComponent[];
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
  activeComponentId: undefined,
  submissionMessage: 'Form submitted successfully!',
  setSubmissionMessage: (message) => set({ submissionMessage: message }),
  setActiveComponentId: (id) => set({ activeComponentId: id }),
  setTitle: (title) => set({ title }),
  setPrimaryColor: (color) => set({ primaryColor: color }),

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
    const newComponent: FormComponent = {
      id: nanoid(),
      type: type,
      showLabel: type !== 'Label',
      props: {
        label: `New ${type}`,
        placeholder: type === 'Input' ? `Enter ${type.toLowerCase()}...` : undefined,
        buttonText: type === 'Button' ? 'Click me' : undefined,
        checkboxText: type === 'Checkbox' ? 'Check me' : undefined,
        switchText: type === 'Switch' ? 'Toggle me' : undefined,
        labelText: type === 'Label' ? 'Label text' : undefined,
        textareaRows: type === 'Textarea' ? 3 : undefined,
        options: type === 'Select' ? ['Option 1', 'Option 2'] : undefined,
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
}));