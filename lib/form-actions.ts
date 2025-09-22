'use server';

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateFormSettings(
  formId: string,
  settings: {
    isPublished?: boolean;
    allowAnonymous?: boolean;
    allowDuplicates?: boolean;
  }
) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      throw new Error('Unauthorized');
    }

    // Verify user owns the form using clerkUserId directly
    const existingForm = await prisma.form.findFirst({
      where: {
        id: formId,
        clerkUserId: clerkUserId,
      },
    });

    if (!existingForm) {
      throw new Error('Form not found or unauthorized');
    }

    // Update form settings
    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        ...(settings.isPublished !== undefined && { published: settings.isPublished }),
        ...(settings.allowAnonymous !== undefined && { acceptsAnonymousResponses: settings.allowAnonymous }),
        ...(settings.allowDuplicates !== undefined && { allowDuplicates: settings.allowDuplicates }),
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/forms/${formId}`);
    revalidatePath('/forms');
    
    if (settings.isPublished !== undefined) {
      revalidatePath(`/s/${updatedForm.shareUrl}`);
    }

    return {
      success: true,
      message: 'Form settings updated successfully',
      form: updatedForm,
    };
  } catch (error) {
    console.error('Error updating form settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update form settings',
    };
  }
}

export async function updateFormTheme(
  formId: string,
  theme: {
    primaryColor?: string;
    backgroundColor?: string;
    brandLogo?: string;
    showPoweredBy?: boolean;
    textColor?: string;
  }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }



    // Verify user owns the form
    const existingForm = await prisma.form.findFirst({
      where: {
        id: formId,
        clerkUserId: userId,
      },
    });

    console.log("Updating form theme for form:", formId, "with theme:", theme);

    if (!existingForm) {
      throw new Error('Form not found or unauthorized');
    }

    // Get current content
    const currentContent = existingForm.content as any;

    // Update form content with theme settings
    const updatedContent = {
      ...currentContent,
      theme: {
        ...currentContent.theme,
        ...theme,
      },
    };

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        content: updatedContent,
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/forms/${formId}`);
    revalidatePath('/forms');
    
    if (existingForm.published) {
      revalidatePath(`/s/${updatedForm.shareUrl}`);
    }

    return {
      success: true,
      message: 'Form theme updated successfully',
      form: updatedForm,
    };
  } catch (error) {
    console.error('Error updating form theme:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update form theme',
    };
  }
}
