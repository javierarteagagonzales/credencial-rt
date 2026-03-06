import Link from 'next/link';
import { ArrowRight, ShieldCheck, Share2, Download } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const settings = await prisma.eventSettings.findFirst() || {
    eventName: "Nebula Tech Conf",
    eventYear: "2026",
    shareMessage: "Join the most advanced tech conference of the decade. Generate your digital credential and join the nebula.",
    primaryColor: "#00f2ff",
    secondaryColor: "#7000ff"
  };

  return (
    <main className="container">
      <section style={{ padding: '8rem 0 4rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {settings.eventName} {settings.eventYear}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto 2rem' }}>
          {settings.shareMessage}
        </p>
        <Link href="/generate" className="btn-primary" style={{
          background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`
        }}>
          Generate My Badge <ArrowRight size={20} />
        </Link>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
        <div className="glass-card">
          <ShieldCheck size={32} color={settings.primaryColor} style={{ marginBottom: '1rem' }} />
          <h3>Verified Entry</h3>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Secure QR-based verification system for all attendees.</p>
        </div>
        <div className="glass-card">
          <Download size={32} color={settings.secondaryColor} style={{ marginBottom: '1rem' }} />
          <h3>Downloadable</h3>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Get a high-resolution PNG of your digital badge.</p>
        </div>
        <div className="glass-card">
          <Share2 size={32} color="#ff00c8" style={{ marginBottom: '1rem' }} />
          <h3>Social Ready</h3>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Share your presence on X and LinkedIn with one click.</p>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', color: '#444', borderTop: '1px solid #111' }}>
        <p>&copy; {settings.eventYear} {settings.eventName}. All rights reserved.</p>
        <Link href="/admin" style={{ fontSize: '0.8rem', marginTop: '1rem', display: 'inline-block' }}>Admin Dashboard</Link>
      </footer>
    </main>
  );
}
