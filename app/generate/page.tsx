'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, User } from 'lucide-react';

export default function GeneratePage() {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !photo) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('photo', photo);

        try {
            const res = await fetch('/api/credentials', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/badge/${data.customId}`);
            } else {
                alert('Failed to generate credential');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Create Your Badge</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: '#888' }}>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            style={{
                                background: '#111',
                                border: '1px solid #222',
                                borderRadius: '8px',
                                padding: '0.8rem',
                                color: 'white',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: '#888' }}>Profile Photo</label>
                        <div
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            style={{
                                height: '150px',
                                border: '2px dashed #333',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                background: preview ? 'none' : '#0a0a0a',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <Upload size={32} color="#444" />
                                    <span style={{ fontSize: '0.8rem', color: '#444', marginTop: '0.5rem' }}>Click to upload</span>
                                </>
                            )}
                        </div>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            required
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Generate Badge'}
                    </button>
                </form>
            </div>

            <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </main>
    );
}
