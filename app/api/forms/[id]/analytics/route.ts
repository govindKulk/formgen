import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getFormAnalytics } from "@/lib/visitor-tracking";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: formId } = await params;

    // Get the internal user ID from clerkUserId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the user owns this form using internal user ID
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        userId: dbUser.id, // Use internal user ID
      }
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found or access denied' }, { status: 404 });
    }

    const analytics = await getFormAnalytics(formId);
    
    return NextResponse.json(analytics, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching form analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
