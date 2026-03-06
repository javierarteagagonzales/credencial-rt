'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Badge from '@/components/Badge';
import { Download, Twitter, Linkedin, Home, CheckCircle2, Share2 } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';

export default function BadgePage() {
    const { id } = useParams();
    const [credential, setCredential] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [qrCode, setQrCode] = useState('');
    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch settings
            const settingsRes = await fetch('/api/settings');
            const settingsData = await settingsRes.json();
            setSettings(settingsData);

            // Fetch badge
            const res = await fetch('/api/credentials');
            const data = await res.json();
            const found = data.find((c: any) => c.customId === id);
            if (found) {
                setCredential(found);
                const qr = await QRCode.toDataURL(`${window.location.origin}/verify/${found.customId}`, {
                    margin: 1,
                    width: 200,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                });
                setQrCode(qr);
            }
        };
        fetchData();
    }, [id]);

    const getBadgeBlob = async () => {
        const node = document.getElementById('badge-to-download');
        if (node) {
            const dataUrl = await toPng(node, { pixelRatio: 2 });
            const blob = await (await fetch(dataUrl)).blob();
            return new File([blob], 'badge.png', { type: 'image/png' });
        }
        return null;
    };

    const handleDownload = async () => {
        const node = document.getElementById('badge-to-download');
        if (node) {
            const dataUrl = await toPng(node, { pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${credential.name.replace(/\s+/g, '-')}-badge.png`;
            link.href = dataUrl;
            link.click();
            setIsDownloaded(true);
        }
    };

    const shareUniversal = async () => {
        const file = await getBadgeBlob();
        const shareData = {
            title: `${credential.name} @ ${settings?.eventName || 'Nebula Tech Conf'}`,
            text: settings?.shareMessage || `I'm attending Nebula Tech Conf 2026! Check out my digital badge:`,
            url: window.location.href,
            files: file ? [file] : undefined,
        };

        if (navigator.share && navigator.canShare && navigator.canShare({ files: shareData.files })) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share failed', err);
                fallbackShare();
            }
        } else {
            fallbackShare();
        }
    };

    const fallbackShare = () => {
        const text = encodeURIComponent(settings?.shareMessage || `I'm attending Nebula Tech Conf 2026! Check out my digital badge:`);
        const hashtags = settings?.shareHashtags || "Nebula2026,TechConf";
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, '_blank');
    };

    const shareX = () => {
        const text = encodeURIComponent(settings?.shareMessage || `I'm attending Nebula Tech Conf 2026! Check out my digital badge:`);
        const hashtags = settings?.shareHashtags || "Nebula2026,TechConf";
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, '_blank');
    };

    const shareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        // LinkedIn reads OG tags from the URL
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    if (!credential) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading your nebula access...</div>;

    return (
        <main className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>Congratulations, {credential.name}!</h2>
                <p style={{ color: '#888', marginTop: '-1rem' }}>Your digital credential is ready for the future.</p>

                <Badge
                    name={credential.name}
                    photoUrl={credential.photoUrl}
                    customId={credential.customId}
                    qrCodeDataUrl={qrCode}
                    settings={settings}
                />

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={shareUniversal} className="btn-primary" style={{ background: 'var(--primary)', color: 'black' }}>
                        <Share2 size={20} /> Share Badge
                    </button>
                    <button onClick={handleDownload} className="btn-primary" style={{ background: '#333', color: 'white' }}>
                        <Download size={20} /> Download PNG
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={shareX} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', color: 'white' }} title="Share on X">
                            <Twitter size={20} />
                        </button>
                        <button onClick={shareLinkedIn} style={{ padding: '0.8rem', borderRadius: '8px', background: '#0077b5', color: 'white' }} title="Share on LinkedIn">
                            <Linkedin size={20} />
                        </button>
                    </div>
                </div>

                {isDownloaded && (
                    <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <CheckCircle2 size={16} /> Saved to your device!
                    </div>
                )}

                <Link href="/" style={{ color: '#444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    <Home size={16} /> Back to Home
                </Link>
            </div>
        </main>
    );
}
