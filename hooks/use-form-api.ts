import { useState, useCallback } from 'react';
import { useFormStore } from '@/store/form';
import { FormCreateData, FormResponseData, FormUpdateData, storeToDatabase } from '@/lib/types/form';
import { FormResponse } from '@prisma/client';

interface UseFormApiProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function useFormApi({ onSuccess, onError }: UseFormApiProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const formState = useFormStore();

  // saves the current form state to the database
  const saveForm = useCallback(async (formId?: string, formTitle?: string) => {
    setIsSaving(true);
    try {
      const formContent = storeToDatabase(formState);
      
      if (formId) {
        // Update existing form
        const updateData: FormUpdateData = {
          id: formId,
          content: formContent,
        };

        const response = await fetch(`/api/forms/${formId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error('Failed to update form');
        }

        const updatedForm = await response.json();
        onSuccess?.('Form saved successfully!');
        return updatedForm;
      } else {

        if(!formTitle || !formContent) {
            throw new Error('Form title and content are required for new forms');
        }
    

        const createData: FormCreateData = {
          title: formTitle,
          content: formContent,
        };

        const response = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });

        if (!response.ok) {
          throw new Error('Failed to create form');
        }

        const newForm = await response.json();
        onSuccess?.('Form created successfully!');
        return newForm;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save form';
      onError?.(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [formState, onSuccess, onError]);

  // Load form from database into store
  const loadForm = useCallback(async (formId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load form');
      }

      const form = await response.json();
      
      // Update the form store with loaded data
      const { content } = form;
      
      // Load complete state into store
      formState.loadFormState({
        steps: content.steps,
        currentStepIndex: content.currentStepIndex,
        title: content.title,
        primaryColor: content.primaryColor,
        submissionMessage: content.submissionMessage,
        formData: content.formData,
      });
      
      return form;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load form';
      onError?.(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formState, onError]);

  // Get all forms for the current user
  const getForms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/forms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch forms';
      onError?.(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Delete a form
  const deleteForm = useCallback(async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      onSuccess?.('Form deleted successfully!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete form';
      onError?.(message);
      throw error;
    }
  }, [onSuccess, onError]);

  // Publish/unpublish a form
  const togglePublish = useCallback(async (formId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form');
      }

      const message = published ? 'Form published successfully!' : 'Form unpublished successfully!';
      onSuccess?.(message);
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update form';
      onError?.(message);
      throw error;
    }
  }, [onSuccess, onError]);

  // load form for the public users
  const loadPublicForm = useCallback(async (formId: string) =>{
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forms/public/${formId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load form');
      }

      const form = await response.json();
      
      // Update the form store with loaded data
      const { content } = form;
      
      console.log('Loading public form content:', content); // Debug log
      
      // Reset form data first to ensure clean state
      formState.resetFormData();
      
      // Load complete state into store
      formState.loadFormState({
        steps: content.steps,
        currentStepIndex: 0, // Always start from first step for public forms
        title: content.title,
        primaryColor: content.primaryColor,
        submissionMessage: content.submissionMessage,
        formData: {}, // Start with empty form data for public forms
      });
      
      const message = 'Form loaded successfully';
      onSuccess?.(message);
      return form;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load form';
      onError?.(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formState, onSuccess, onError]);

  const submitResponse = useCallback(async (formId: string, responseData: Record<string, any>) => {
    setIsSaving(true);
    try {
      if (!formId) {
        throw new Error("Form ID is required");
      }

      console.log('Submitting response:', { formId, responseData });

      const response = await fetch(`/api/forms/public/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: responseData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit form response');
      }

      const result = await response.json();
      onSuccess?.('Form submitted successfully!');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit form response';
      onError?.(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [onSuccess, onError])

  return {
    isLoading,
    isSaving,
    saveForm,
    loadForm,
    getForms,
    deleteForm,
    togglePublish,
    loadPublicForm,
    submitResponse
  };
}
