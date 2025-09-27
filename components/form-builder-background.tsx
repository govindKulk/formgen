"use client";

import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput, FormTextarea, FormSelect, FormCheckbox, FormButton, FormMCQ } from "./form-fields-enhanced";
import { FormComponent } from "@/store/form";

const FormBuilderBackground = () => {
  const methods = useForm();

  // Sample form components to display
  const sampleInput: FormComponent = {
    id: "email",
    type: "Input",
    showLabel: true,
    required: true,
    props: {
      label: "Email Address",
      placeholder: "Enter your email...",
      inputType: "email"
    }
  };

  const sampleTextarea: FormComponent = {
    id: "message",
    type: "Textarea", 
    showLabel: true,
    required: false,
    props: {
      label: "Message",
      placeholder: "Share your thoughts...",
      textareaRows: 3
    }
  };

  const sampleSelect: FormComponent = {
    id: "category",
    type: "Select",
    showLabel: true,
    required: true,
    props: {
      label: "Category",
      options: ["Business", "Personal", "Support", "Other"]
    }
  };

  const sampleCheckbox: FormComponent = {
    id: "terms",
    type: "Checkbox",
    showLabel: true,
    required: true,
    props: {
      label: "I agree to terms",
      checkboxText: "I agree to the terms and conditions"
    }
  };

  const sampleButton: FormComponent = {
    id: "submit",
    type: "Button",
    showLabel: false,
    required: false,
    props: {
      buttonText: "Submit Form",
      label: "Submit"
    }
  };

  const sampleMCQ: FormComponent = {
    id: "rating",
    type: "MCQ",
    showLabel: true,
    required: false,
    props: {
      label: "How satisfied are you?",
      options: ["Very Happy", "Happy", "Neutral", "Unhappy"]
    },
    quiz: {
      isMultipleChoice: false
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Floating Input Field */}
        <motion.div
          className="absolute top-20 left-1/8 opacity-60"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="p-4 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm min-w-[240px] shadow-lg">
            <FormInput component={sampleInput} className="pointer-events-none" />
          </div>
        </motion.div>

        {/* Floating Button */}
        <motion.div
          className="absolute top-40 right-1/8 opacity-60"
          animate={{ 
            scale: [1, 1.05, 1],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="p-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm shadow-lg">
            <FormButton component={sampleButton} className="pointer-events-none opacity-80" />
          </div>
        </motion.div>

      {/* Drag and Drop Visual */}
      <motion.div
        className="absolute bottom-32 left-1/8 opacity-25"
        animate={{ 
          x: [0, 20, 0],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <div className="flex items-center gap-3 p-3 bg-white/10 dark:bg-white/5 border border-dashed border-white/40 dark:border-white/20 rounded-lg backdrop-blur-sm shadow-md">
          <GripVertical className="w-4 h-4 text-foreground/60" />
          <div className="flex flex-col gap-2">
            <div className="w-20 h-2 bg-foreground/30 rounded"></div>
            <div className="w-16 h-2 bg-foreground/20 rounded"></div>
          </div>
        </div>
      </motion.div>

      {/* Form Steps Indicator */}
      <motion.div
        className="absolute top-1/2 right-4 opacity-60"
        animate={{ 
          scale: [1, 1.3]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="flex items-center gap-2 p-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full backdrop-blur-sm shadow-lg">
          <div className="w-8 h-8 bg-primary/60 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xs text-white font-bold">1</span>
          </div>
          <div className="w-10 h-1 bg-foreground/30 rounded"></div>
          <div className="w-8 h-8 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center">
            <span className="text-xs text-foreground/60 font-bold">2</span>
          </div>
          <div className="w-10 h-1 bg-foreground/20 rounded"></div>
          <div className="w-8 h-8 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center">
            <span className="text-xs text-foreground/60 font-bold">3</span>
          </div>
        </div>
      </motion.div>

        {/* Floating Checkbox */}
        <motion.div
          className="absolute bottom-4 left-1/2  opacity-45 -translate-x-1/2"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <div className="p-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm shadow-lg min-w-[200px]">
            <FormCheckbox component={sampleCheckbox} className="pointer-events-none" />
          </div>
        </motion.div>

        {/* Floating Select Dropdown */}
        <motion.div
          className="absolute top-1/2 left-1/6 opacity-25"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >
          <div className="p-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm min-w-[200px] shadow-lg">
            <FormSelect component={sampleSelect} className="pointer-events-none" />
          </div>
        </motion.div>

        {/* MCQ Form Component */}
        <motion.div
          className="absolute bottom-20 left-1/3 opacity-20"
          animate={{ 
            scale: [1, 1.02, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <div className="p-4 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm shadow-lg min-w-[280px]">
            <FormMCQ component={sampleMCQ} className="pointer-events-none" />
          </div>
        </motion.div>

        {/* Floating Text Area */}
        <motion.div
          className="absolute top-3/4 right-4 opacity-50"
          animate={{ 
            rotate: [0, -2, 2, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          <div className="p-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg backdrop-blur-sm min-w-[240px] shadow-lg">
            <FormTextarea component={sampleTextarea} className="pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
};

export default FormBuilderBackground;