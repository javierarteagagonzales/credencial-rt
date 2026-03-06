import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await props.params;
    const [credential, settings] = await Promise.all([
        prisma.credential.findUnique({ where: { customId: id } }),
        prisma.eventSettings.findFirst()
    ]);

    if (!credential) {
        return {
            title: 'Badge Not Found | Event Tool',
        };
    }

    const eventName = settings?.eventName || 'Nebula Tech Conf';
    const eventYear = settings?.eventYear || '2026';
    const defaultShareMessage = `I'm attending ${eventName} ${eventYear}! Check out my official digital credential.`;

    const title = `${credential.name} @ ${eventName} ${eventYear}`;
    const description = settings?.shareMessage || defaultShareMessage;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function BadgeLayout(props: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    return <>{props.children}</>;
}
