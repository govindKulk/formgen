// Types that match the Prisma Form model for better type safety
// These types ensure consistency between your form store and database

import { FormStep, FormStore } from '@/store/form';

// Complete form content structure that gets stored in the database
export interface StoredFormContent extends Partial<FormStore> {
  steps: FormStep[];
  currentStepIndex: number;
  title: string;
  submissionMessage: string;
  formData: Record<string, any>;
}

// Form data structure for API operations
export interface FormCreateData {
  description?: string;
  title?: string;
  primaryColor?: string;
  submissionMessage?: string;
  content: StoredFormContent;
  published?: boolean;
  acceptsAnonymousResponses?: boolean;
}

export interface FormUpdateData extends Partial<FormCreateData> {
  id: string;
}

// Form response data structure
export interface FormResponseData {
  formId: string;
  content: Record<string, any>; // The actual form field responses
  responderId?: string;
  responderName?: string;
  responderEmail?: string;
  responderIp?: string;
  responderUserAgent?: string;
  responderLocation?: string;
}

// Helper functions to convert between store and database formats
export function storeToDatabase(storeState: FormStore): StoredFormContent {
  return {
    steps: storeState.steps || [],
    currentStepIndex: storeState.currentStepIndex || 0,
    title: storeState.title || 'My Form',
    submissionMessage: storeState.submissionMessage || 'Form submitted successfully!',
    formData: storeState.formData || {},
    theme: storeState.theme || {},

  };
}

export function databaseToStore(dbContent: StoredFormContent): Partial<FormStore> {
  console.log("dbcontent", dbContent);

  return {
    steps: dbContent.steps || [],
    currentStepIndex: dbContent.currentStepIndex || 0,
    title: dbContent.title || 'My Form',
    submissionMessage: dbContent.submissionMessage || 'Form submitted successfully!',
    formData: dbContent.formData || {},
    theme: {
      primaryColor: dbContent.theme?.primaryColor || '#000000',
      backgroundColor: dbContent.theme?.backgroundColor || '#ffffff',
      brandLogo: dbContent.theme?.brandLogo, // Default logo
      showPoweredBy: dbContent.theme?.showPoweredBy as boolean, // Default powered by setting
      textColor: dbContent.theme?.textColor || '#000000', // Default text color
    },


  };
}
