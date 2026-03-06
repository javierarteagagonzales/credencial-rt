import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function GET() {
    try {
        let settings = await prisma.eventSettings.findFirst();
        if (!settings) {
            settings = await prisma.eventSettings.create({
                data: {}
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const eventName = formData.get('eventName') as string;
        const eventYear = formData.get('eventYear') as string;
        const shareMessage = formData.get('shareMessage') as string;
        const shareHashtags = formData.get('shareHashtags') as string;
        const primaryColor = formData.get('primaryColor') as string;
        const secondaryColor = formData.get('secondaryColor') as string;
        const adminPassword = formData.get('adminPassword') as string;
        const logoFile = formData.get('logo') as File | null;

        let eventLogoUrl: string | undefined;

        if (logoFile && logoFile.size > 0) {
            const blob = await put(`logos/event-logo-${Date.now()}`, logoFile, {
                access: 'public',
            });
            eventLogoUrl = blob.url;
        }

        const currentSettings = await prisma.eventSettings.findFirst();

        const updateData: any = {
            eventName,
            eventYear,
            shareMessage,
            shareHashtags,
            primaryColor,
            secondaryColor,
        };

        if (adminPassword) {
            updateData.adminPassword = adminPassword;
        }

        if (eventLogoUrl) {
            updateData.eventLogoUrl = eventLogoUrl;
        }

        const settings = await prisma.eventSettings.upsert({
            where: { id: currentSettings?.id || 1 },
            update: updateData,
            create: {
                id: 1,
                ...updateData,
                eventLogoUrl: eventLogoUrl || '/logo.png'
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
