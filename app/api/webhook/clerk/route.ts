import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Get the Webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400
        });
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    try {
        if (eventType === "user.created") {
            const { data } = body;

            // Validate required data
            if (!data.id) {
                return new Response('Missing required user ID', { status: 400 });
            }

            // Check if user already exists (prevent duplicates)
            const existingUser = await prisma.user.findUnique({
                where: { clerkUserId: data.id }
            });

            if (existingUser) {
                console.log(`User ${data.id} already exists, skipping creation`);
                return new Response(JSON.stringify({ success: true, message: 'User already exists' }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    clerkUserId: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: data.full_name || "",
                    image: data.profile_image_url || "",
                    phone: data.phone_numbers?.[0]?.phone_number || "",
                    firstName: data.first_name || "",
                    lastName: data.last_name || ""
                }
            });

            console.log(`Successfully created user: ${newUser.clerkUserId}`);
            return new Response(JSON.stringify({ success: true, userId: newUser.id }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (eventType === "user.updated") {
            // Handle user updates
            const { data } = body;

            await prisma.user.update({
                where: { clerkUserId: data.id },
                data: {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: data.full_name || "",
                    image: data.profile_image_url || "",
                    phone: data.phone_numbers?.[0]?.phone_number || "",
                    firstName: data.first_name || "",
                    lastName: data.last_name || ""
                }
            });

            return new Response(JSON.stringify({ success: true }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (eventType === "user.deleted") {
            // Handle user deletion
            const { data } = body;

            await prisma.user.delete({
                where: { clerkUserId: data.id }
            });

            return new Response(JSON.stringify({ success: true }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Unhandled event type
        return new Response(JSON.stringify({ message: `Unhandled event type: ${eventType}` }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response(JSON.stringify({ 
            error: 'Database operation failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}