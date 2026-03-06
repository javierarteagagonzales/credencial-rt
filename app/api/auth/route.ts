import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        let settings = await prisma.eventSettings.findFirst();
        if (!settings) {
            settings = await prisma.eventSettings.create({ data: {} });
        }

        if (password === settings.adminPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return NextResponse.json({ authenticated: session?.value === 'authenticated' });
}
