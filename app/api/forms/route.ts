import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { FormCreateData, storeToDatabase } from '@/lib/types/form';

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: FormCreateData = await request.json();

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { id: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const form = await prisma.form.create({
      data: {
        description: body.description || '',
        title: body.content.title || 'My Form',
        primaryColor: body.content.theme?.primaryColor || '#3b82f6',
        submissionMessage: body.content.submissionMessage || 'Form submitted successfully!',
        content: JSON.parse(JSON.stringify(body.content)), 
        published: body.published || false,
        acceptsAnonymousResponses: body.acceptsAnonymousResponses || false,
        userId: dbUser.id,
        clerkUserId
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}

// GET /api/forms - Get all forms for the current user
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    
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

    const forms = await prisma.form.findMany({
      where: { userId: dbUser.id }, // Use internal user ID
      select: {
        id: true,
        description: true,
        title: true,
        primaryColor: true,
        submissionMessage: true,
        published: true,
        visits: true,
        submissions: true,
        shareUrl: true,
        acceptsAnonymousResponses: true,
        createdAt: true,
        updatedAt: true,
        // not including content in list view for performance
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}
