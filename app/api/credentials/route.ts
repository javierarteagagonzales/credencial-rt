import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const photo = formData.get('photo') as File;

        if (!name || !photo) {
            return NextResponse.json({ error: 'Name and photo are required' }, { status: 400 });
        }

        let photoUrl = '';

        // If we are in production (or have blob token), use Vercel Blob
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(`attendees/${Date.now()}-${photo.name}`, photo, {
                access: 'public',
            });
            photoUrl = blob.url;
        } else {
            // Fallback for local development WITHOUT blob token
            // (Simplified: in a real app you might keep local logic, but blob is easier for dev too)
            const blob = await put(`attendees/${Date.now()}-${photo.name}`, photo, {
                access: 'public',
            });
            photoUrl = blob.url;
        }

        const customId = `NBL-${uuidv4().substring(0, 8).toUpperCase()}`;

        const credential = await prisma.credential.create({
            data: {
                name,
                photoUrl,
                customId,
            },
        });

        return NextResponse.json(credential);
    } catch (error) {
        console.error('Error creating credential:', error);
        return NextResponse.json({ error: 'Failed to create credential' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const credentials = await prisma.credential.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(credentials);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
    }
}
