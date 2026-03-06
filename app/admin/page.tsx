'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, ExternalLink, Calendar, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [credentials, setCredentials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredentials = async () => {
            const res = await fetch('/api/credentials');
            const data = await res.json();
            setCredentials(data);
            setLoading(false);
        };
        fetchCredentials();
    }, []);

    return (
        <main className="container" style={{ padding: '4rem 0' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                    <p style={{ color: '#888' }}>Manage all generated event credentials</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/admin/settings" className="btn-primary" style={{ background: '#222', color: 'white', fontSize: '0.9rem' }}>
                        <Settings size={18} /> Personalize Event
                    </Link>
                    <div style={{ background: 'var(--glass)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>TOTAL ATTENDEES</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{credentials.length}</div>
                    </div>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1.5rem 2rem', fontWeight: '600', color: '#666', fontSize: '0.8rem' }}>ATTENDEE</th>
                            <th style={{ padding: '1.5rem 2rem', fontWeight: '600', color: '#666', fontSize: '0.8rem' }}>ID</th>
                            <th style={{ padding: '1.5rem 2rem', fontWeight: '600', color: '#666', fontSize: '0.8rem' }}>CREATED</th>
                            <th style={{ padding: '1.5rem 2rem', fontWeight: '600', color: '#666', fontSize: '0.8rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#444' }}>Loading data...</td>
                            </tr>
                        ) : credentials.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#444' }}>No credentials generated yet.</td>
                            </tr>
                        ) : (
                            credentials.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img src={c.photoUrl} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ fontWeight: '500' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem', fontFamily: 'var(--font-geist-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>
                                        {c.customId}
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem', color: '#666', fontSize: '0.8rem' }}>
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <Link href={`/badge/${c.customId}`} style={{ color: '#888' }} target="_blank">
                                                <ExternalLink size={18} />
                                            </Link>
                                            <Link href={`/verify/${c.customId}`} style={{ color: '#888' }} target="_blank">
                                                <Search size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Link href="/" style={{ color: '#444', fontSize: '0.9rem' }}>&lsaquo; Back to Landing Page</Link>
            </div>
        </main>
    );
}
