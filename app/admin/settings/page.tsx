'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Image as ImageIcon, MessageSquare, Palette, Save, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [settings, setSettings] = useState({
        eventName: '',
        eventYear: '',
        eventLogoUrl: '',
        shareMessage: '',
        shareHashtags: '',
        primaryColor: '',
        secondaryColor: '',
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLogoPreview(data.eventLogoUrl);
                setLoading(false);
            });
    }, []);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append('eventName', settings.eventName);
        formData.append('eventYear', settings.eventYear);
        formData.append('shareMessage', settings.shareMessage);
        formData.append('shareHashtags', settings.shareHashtags);
        formData.append('primaryColor', settings.primaryColor);
        formData.append('secondaryColor', settings.secondaryColor);
        //@ts-ignore
        if (settings.adminPassword) {
            //@ts-ignore
            formData.append('adminPassword', settings.adminPassword);
        }
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            alert('Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading settings...</div>;

    return (
        <main className="container" style={{ padding: '4rem 0' }}>
            <header style={{ marginBottom: '3rem' }}>
                <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '2.5rem' }}>Personalize Event</h1>
                <p style={{ color: '#888' }}>Customize your badge generator and social sharing options</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Basic Info */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings size={20} color="var(--primary)" /> Event Identity
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Event Name</label>
                                <input
                                    type="text"
                                    value={settings.eventName}
                                    onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Edition / Year</label>
                                <input
                                    type="text"
                                    value={settings.eventYear}
                                    onChange={(e) => setSettings({ ...settings, eventYear: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Admin Password</label>
                                <input
                                    type="password"
                                    //@ts-ignore
                                    value={settings.adminPassword || ''}
                                    //@ts-ignore
                                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Change master password"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Event Logo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                                    <img src={logoPreview || ''} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#111', borderRadius: '8px', padding: '8px' }} />
                                    <button type="button" onClick={() => document.getElementById('logo-upload')?.click()} className="btn-primary" style={{ background: '#222', color: 'white', fontSize: '0.8rem' }}>
                                        <ImageIcon size={16} /> Change Logo
                                    </button>
                                    <input id="logo-upload" type="file" hidden accept="image/*" onChange={handleLogoChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={20} color="var(--primary)" /> Social Sharing
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Default Message</label>
                                <textarea
                                    value={settings.shareMessage}
                                    onChange={(e) => setSettings({ ...settings, shareMessage: e.target.value })}
                                    style={{ ...inputStyle, height: '80px', resize: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Hashtags (comma separated)</label>
                                <input
                                    type="text"
                                    value={settings.shareHashtags}
                                    onChange={(e) => setSettings({ ...settings, shareHashtags: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Nebula2026,TechConf"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '50px' }}>
                        {saving ? <Loader2 className="animate-spin" /> : (
                            <>
                                {success ? <CheckCircle2 /> : <Save />}
                                {success ? 'Saved Successfully!' : 'Update Personalization'}
                            </>
                        )}
                    </button>
                </form>

                {/* Preview / Instructions */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <div className="glass-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#666' }}>Design Tokens</h3>
                        <p style={{ fontSize: '0.9rem', color: '#444' }}>These colors will be used as CSS variables across the entire application.</p>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: settings.primaryColor, borderRadius: '8px', border: '2px solid rgba(255,255,255,0.1)' }}></div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Primary Color</div>
                                        <div style={{ fontSize: '0.7rem', color: '#666' }}>Used for glows & buttons</div>
                                    </div>
                                </div>
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    style={{ background: 'none', border: 'none', width: '30px', height: '30px', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: settings.secondaryColor, borderRadius: '8px', border: '2px solid rgba(255,255,255,0.1)' }}></div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Secondary Color</div>
                                        <div style={{ fontSize: '0.7rem', color: '#666' }}>Used for card gradients</div>
                                    </div>
                                </div>
                                <input
                                    type="color"
                                    value={settings.secondaryColor}
                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                    style={{ background: 'none', border: 'none', width: '30px', height: '30px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </main>
    );
}

const inputStyle = {
    width: '100%',
    background: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '0.8rem',
    color: 'white',
    marginTop: '0.4rem',
    outline: 'none',
    fontSize: '0.9rem',
};
