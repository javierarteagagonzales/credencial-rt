'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                setError('Acceso denegado. Contraseña incorrecta.');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,100,100,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Lock size={32} color="#ff4d4d" />
                </div>

                <h2 style={{ marginBottom: '0.5rem' }}>Admin Portal</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>This area is restricted. Please enter the master key.</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            background: '#111',
                            border: '1px solid #222',
                            borderRadius: '8px',
                            padding: '1rem',
                            color: 'white',
                            outline: 'none',
                            textAlign: 'center',
                            letterSpacing: '0.5rem'
                        }}
                        required
                        autoFocus
                    />

                    {error && (
                        <div style={{ color: '#ff4d4d', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                            <ShieldAlert size={14} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', height: '50px', background: '#fff', color: '#000' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Decrypt Access'}
                    </button>
                </form>
            </div>

            <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </main>
    );
}
