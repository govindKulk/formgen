import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { FormUpdateData, databaseToStore } from '@/lib/types/form';

// GET /api/forms/[id] - Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    const {id} = await params;
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the internal user ID from clerkUserId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const form = await prisma.form.findFirst({
      where: { 
        id,
        userId: dbUser.id, // Use internal user ID
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Convert database content to store format for the frontend
    const formWithParsedContent = {
      ...form,
      content: databaseToStore(form.content as any),
    };

    return NextResponse.json(formWithParsedContent);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
}

// PUT /api/forms/[id] - Update a specific form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    const {id} = await params;
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the internal user ID from clerkUserId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body: Partial<FormUpdateData> = await request.json();

    // Verify the form belongs to the user
    const existingForm = await prisma.form.findFirst({
      where: { 
        id,
        userId: dbUser.id, // Use internal user ID
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.description !== undefined) updateData.description = body.description;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.acceptsAnonymousResponses !== undefined) {
      updateData.acceptsAnonymousResponses = body.acceptsAnonymousResponses;
    }
    
    // Handle content updates
    if (body.content) {
      updateData.title = body.content.title;
      updateData.primaryColor = body.content.primaryColor;
      updateData.submissionMessage = body.content.submissionMessage;
      updateData.content = JSON.parse(JSON.stringify(body.content));
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}

// DELETE /api/forms/[id] - Delete a specific form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    const {id} = await params;
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the internal user ID from clerkUserId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the form belongs to the user
    const existingForm = await prisma.form.findFirst({
      where: { 
        id,
        userId: dbUser.id, // Use internal user ID
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    await prisma.form.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
}
