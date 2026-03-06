import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Props {
    params: { id: string };
    children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
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

export default function BadgeLayout({ children }: Props) {
    return <>{children}</>;
}
