// Types that match the Prisma Form model for better type safety
// These types ensure consistency between your form store and database

import { FormStep } from '@/store/form';

// Complete form content structure that gets stored in the database
export interface StoredFormContent {
  steps: FormStep[];
  currentStepIndex: number;
  title: string;
  primaryColor: string;
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
export function storeToDatabase(storeState: any): StoredFormContent {
  return {
    steps: storeState.steps,
    currentStepIndex: storeState.currentStepIndex,
    title: storeState.title,
    primaryColor: storeState.primaryColor,
    submissionMessage: storeState.submissionMessage,
    formData: storeState.formData,
  };
}

export function databaseToStore(dbContent: StoredFormContent) {
  return {
    steps: dbContent.steps || [],
    currentStepIndex: dbContent.currentStepIndex || 0,
    title: dbContent.title || 'My Form',
    primaryColor: dbContent.primaryColor || '#3b82f6',
    submissionMessage: dbContent.submissionMessage || 'Form submitted successfully!',
    formData: dbContent.formData || {},
  };
}
