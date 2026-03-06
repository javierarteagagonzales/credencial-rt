import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Nebula Tech Conf Badge';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [credential, settings] = await Promise.all([
        prisma.credential.findUnique({ where: { customId: id } }),
        prisma.eventSettings.findFirst()
    ]);

    if (!credential) {
        return new Response('Not found', { status: 404 });
    }

    const eventName = settings?.eventName || "NEBULA TECH CONF";
    const eventYear = settings?.eventYear || "2026";
    const logoUrl = settings?.eventLogoUrl || "/logo.png";
    const primaryColor = settings?.primaryColor || "#00f2ff";
    const secondaryColor = settings?.secondaryColor || "#7000ff";

    // Helper to fetch image and convert to base64
    const getBase64 = async (url: string) => {
        try {
            if (url.startsWith('http')) {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                return `data:image/png;base64,${buffer.toString('base64')}`;
            } else {
                const filePath = path.join(process.cwd(), 'public', url.startsWith('/') ? url.substring(1) : url);
                const data = fs.readFileSync(filePath);
                return `data:image/png;base64,${data.toString('base64')}`;
            }
        } catch (e) {
            return '';
        }
    };

    const logoBase64 = await getBase64(logoUrl);
    const photoBase64 = await getBase64(credential.photoUrl);

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#050505',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                    padding: '40px',
                }}
            >
                <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, background: `radial-gradient(circle, ${primaryColor}1a 0%, transparent 70%)` }}></div>
                <div style={{ position: 'absolute', bottom: -200, right: -200, width: 600, height: 600, background: `radial-gradient(circle, ${secondaryColor}26 0%, transparent 70%)` }}></div>

                <div
                    style={{
                        display: 'flex',
                        width: '900px',
                        height: '450px',
                        backgroundColor: 'rgba(15, 15, 15, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ display: 'flex', width: '400px', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <div style={{ display: 'flex', width: '300px', height: '300px', borderRadius: '150px', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, padding: '8px' }}>
                            <img
                                src={photoBase64}
                                style={{ width: '100%', height: '100%', borderRadius: '150px', objectFit: 'cover', backgroundColor: '#111' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 60px 40px 0', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={logoBase64} style={{ width: '60px', height: '60px', marginRight: '20px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>{eventName}</span>
                                <span style={{ fontSize: '18px', color: primaryColor }}>{eventYear}</span>
                            </div>
                        </div>

                        <h1 style={{ fontSize: '64px', fontWeight: '900', margin: '0 0 10px 0', textTransform: 'uppercase' }}>{credential.name}</h1>
                        <div style={{ fontSize: '20px', letterSpacing: '8px', color: '#666', fontWeight: 'bold', marginBottom: '40px' }}>ATTENDEE</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', color: '#444', fontWeight: 'bold' }}>CREDENTIAL DNA</span>
                                <span style={{ fontSize: '18px', color: '#888', fontFamily: 'monospace' }}>{credential.customId}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', color: primaryColor }}>
                                <div style={{ width: '8px', height: '8px', background: primaryColor, borderRadius: '4px', marginRight: '10px' }}></div>
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
