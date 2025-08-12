import prisma from "@/lib/db";
import { databaseToStore } from "@/lib/types/form";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { trackUniqueVisitor } from "@/lib/visitor-tracking";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    console.log("Fetching public form with ID:", id);

    if (!id) {
        return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    try {

        const form = await prisma.form.findUnique({
            where: { shareUrl: id },
        });

        if (!form) {
            console.error("Form not found for ID:", id);
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        // Track unique visitors by IP with comprehensive fallback strategy and email support
        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        
        const userAgent = request.headers.get('user-agent') || '';

        // Check if user is authenticated and get their email
        let visitorEmail: string | undefined;
        try {
            const { userId } = await auth();
            if (userId) {
                const dbUser = await prisma.user.findUnique({
                    where: { clerkUserId: userId },
                    select: { email: true }
                });
                visitorEmail = dbUser?.email || undefined;
            }
        } catch (error) {
            // Auth failed or user not logged in - this is fine for public forms
            console.log('User not authenticated for form visit (this is normal for public forms)');
        }

        console.log('Tracking visitor:', { 
            formId: form.id, 
            clientIp, 
            userAgent: userAgent.substring(0, 100),
            hasEmail: !!visitorEmail
        });

        // Track visitor using comprehensive strategy (Redis > Database > Memory > None)
        try {
            const trackingResult = await trackUniqueVisitor(form.id, clientIp, userAgent, visitorEmail);
            console.log('Visitor tracking result:', trackingResult);
        } catch (error) {
            console.error('Visitor tracking error:', error);
            // Continue serving the form even if tracking fails
        }


        const formWithParsedContent = {
            ...form,
            content: databaseToStore(form.content as any),
        }

        return NextResponse.json(formWithParsedContent, { status: 200 });

    } catch (error) {
        console.error('Error fetching form:', error);
        return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
    }

}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const body = await request.json();
        const { id } = await params;

        console.log('Received form submission:', { id, body });

        const form = await prisma.form.findUnique({
            where: { shareUrl: id }
        });

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        if (!form.published) {
            return NextResponse.json({ error: 'Form is not published' }, { status: 403 });
        }

        if (form.acceptsAnonymousResponses) {
            // Handle anonymous response submission
            const responseData = {
                content: body.content || {},
                responderIp: request.headers.get('x-forwarded-for'),
                responderUserAgent: request.headers.get('user-agent'),
            }


            const response = await prisma.formResponse.create({
                data: {
                    ...responseData,
                    formId: form.id,
                },
            });

            console.log("Anonymous response submitted:", response);

            // Increment form submissions count
            await prisma.form.update({
                where: { id: form.id },
                data: { 
                    submissions: { increment: 1 }
                }
            });

            return NextResponse.json({ message: 'Response submitted successfully', responseId: response.id }, { status: 201 });
        } else {
            // Handle authenticated user response submission
            const { userId: clerkUserId } = await auth();

            if (!clerkUserId) {
                return NextResponse.json({ error: 'User must be authenticated to submit this form' }, { status: 403 });
            }

            const dbUser = await prisma.user.findUnique({
                where: {
                    clerkUserId: clerkUserId
                }
            });

            if (!dbUser) {
                return NextResponse.json({ error: 'User not found, please login with correct credentials.' }, { status: 404 });
            }

            const responseData = {
                content: body.content || {},
                responderId: dbUser.id, // Use internal user ID, not clerkUserId
                responderIp: request.headers.get('x-forwarded-for'),
                responderUserAgent: request.headers.get('user-agent'),
            }

            const response = await prisma.formResponse.create({
                data: {
                    ...responseData,
                    formId: form.id,
                    responderName: dbUser.name,
                    responderEmail: dbUser.email,
                }
            });

            console.log("Authenticated response submitted:", response);

            // Increment form submissions count
            await prisma.form.update({
                where: { id: form.id },
                data: { 
                    submissions: { increment: 1 }
                }
            });

            return NextResponse.json({ message: 'Response submitted successfully', responseId: response.id }, { status: 201 });
        }
    } catch (error) {
        console.error('Error processing form submission:', error);
        return NextResponse.json({ error: 'Failed to process form submission' }, { status: 500 });
    }


}