'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, XCircle, Clock, User, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
    const { id } = useParams();
    const [credential, setCredential] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadge = async () => {
            const res = await fetch('/api/credentials');
            const data = await res.json();
            const found = data.find((c: any) => c.customId === id);
            setCredential(found);
            setLoading(false);
        };
        fetchBadge();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Verifying credential...</div>;

    return (
        <main className="container" style={{ padding: '6rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                {credential ? (
                    <>
                        <ShieldCheck size={64} color="#00f2ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>VERIFIED CREDENTIAL</h1>
                        <p style={{ color: '#888', marginBottom: '3rem' }}>This digital badge is authentic and issued by Nebula Tech Conf 2026.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase' }}>Attendee</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginTop: '0.3rem' }}>
                                    <User size={16} /> {credential.name}
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase' }}>Issue Date</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginTop: '0.3rem' }}>
                                    <Clock size={16} /> {new Date(credential.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase' }}>Credential DNA</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginTop: '0.3rem', fontFamily: 'var(--font-geist-mono)', color: 'var(--primary)' }}>
                                    <Fingerprint size={16} /> {credential.customId}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <Link href="/" className="btn-primary" style={{ background: '#222', color: 'white' }}>
                                Return to Site
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle size={64} color="#ff4d4d" style={{ margin: '0 auto 1.5rem' }} />
                        <h1 style={{ color: '#ff4d4d', marginBottom: '1rem' }}>INVALID CREDENTIAL</h1>
                        <p style={{ color: '#888', marginBottom: '3rem' }}>The credential ID could not be found in our secure database.</p>
                        <Link href="/" className="btn-primary">
                            Return Home
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}
