import {create} from 'zustand';
import {nanoid} from 'nanoid';


export type FormComponentType = 'Input' | 'Button' | 'Checkbox' | 'Textarea' | 'Select' | 'Switch' | 'Label' | 'Dialog' | 'Tooltip';


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
  components: FormComponent[];
  title: string;
  stepTitle: string;
  primaryColor: string;
  activeComponentId?: string;
  submissionMessage: string;
  setSubmissionMessage: (message: string) => void;
  setTitle: (title: string) => void;
  setStepTitle: (stepTitle: string) => void;
  setPrimaryColor: (color: string) => void;
  setActiveComponentId: (id?: string) => void;
  addComponent: (index: number, type: FormComponentType) => void;
  removeComponent: (id: string) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  updateComponent: (id: string, props: Partial<FormComponent['props']>) => void;
  updateComponentMeta: (id: string, meta: Partial<Omit<FormComponent, 'props'>>) => void;
  reorderComponents: (newOrder: FormComponent[]) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  components: [],
  title: 'My Form',
  stepTitle: 'Step 1',
  primaryColor: '#3b82f6',
  activeComponentId: undefined,
  submissionMessage: 'Form submitted successfully!',
  setSubmissionMessage: (message) => set({ submissionMessage: message }),
  setActiveComponentId: (id) => set({ activeComponentId: id }),
  setTitle: (title) => set({ title }),
  setStepTitle: (stepTitle) => set({ stepTitle }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  // Adds a new component to the canvas at a specific index
  addComponent: (index, type) => {
    const newComponent: FormComponent = {
      id: nanoid(), // Generate a unique ID
      type: type,
      showLabel: type !== 'Label', // Labels don't show their own label
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
      const newComponents = [...state.components];
      newComponents.splice(index, 0, newComponent);
      return { components: newComponents };
    });
  },

  // Removes a component from the canvas
  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
    }));
  },

  // Moves a component from one position to another (for reordering)
  moveComponent: (dragIndex, hoverIndex) => {
    set((state) => {
      // Ensure indices are valid
      if (dragIndex < 0 || hoverIndex < 0 || 
          dragIndex >= state.components.length || 
          hoverIndex >= state.components.length ||
          dragIndex === hoverIndex) {
        console.log("drag-inddex", dragIndex, "hover-index", hoverIndex);
        console.log(state.components);
        return state; // No change if indices are invalid or same
      }

      const newComponents = [...state.components];
      const [removed] = newComponents.splice(dragIndex, 1);
      console.log(removed);
      newComponents.splice(hoverIndex, 0, removed);
      return { components: newComponents };
    });
  },

  // Updates component properties
  updateComponent: (id, newProps) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id
          ? { ...component, props: { ...component.props, ...newProps } }
          : component
      ),
    }));
  },

  // Updates component metadata (like showLabel, type, etc.)
  updateComponentMeta: (id, newMeta) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id
          ? { ...component, ...newMeta }
          : component
      ),
    }));
  },

  // Reorder components (useful for database persistence)
  reorderComponents: (newOrder) => {
    set(() => ({
      components: newOrder,
    }));
  },
}));