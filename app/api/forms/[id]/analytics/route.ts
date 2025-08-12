import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getFormAnalytics } from "@/lib/visitor-tracking";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: formId } = await params;

    // Verify the user owns this form
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        user: {
          clerkUserId: userId
        }
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
