'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Badge.module.css';

interface BadgeProps {
    name: string;
    photoUrl: string;
    customId: string;
    qrCodeDataUrl: string;
    settings?: {
        eventName: string;
        eventYear: string;
        eventLogoUrl: string;
        primaryColor: string;
        secondaryColor: string;
    };
}

const Badge: React.FC<BadgeProps> = ({ name, photoUrl, customId, qrCodeDataUrl, settings }) => {
    const eventName = settings?.eventName || "NEBULA TECH CONF";
    const eventYear = settings?.eventYear || "2026";
    const logoUrl = settings?.eventLogoUrl || "/logo.png";
    const primaryColor = settings?.primaryColor || "#00f2ff";
    const secondaryColor = settings?.secondaryColor || "#7000ff";

    return (
        <div className={styles.badgeContainer} id="badge-to-download" style={{
            //@ts-ignore
            '--primary': primaryColor,
            '--secondary': secondaryColor
        }}>
            <div className={styles.badgeCard}>
                {/* Decorative elements */}
                <div className={styles.glow1}></div>
                <div className={styles.glow2}></div>

                <div className={styles.header}>
                    <img src={logoUrl} alt="Event Logo" width={60} height={60} className={styles.logo} />
                    <div className={styles.eventInfo}>
                        <span className={styles.eventName}>{eventName}</span>
                        <span className={styles.eventYear}>{eventYear}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.photoWrapper}>
                        <img src={photoUrl} alt={name} className={styles.photo} />
                    </div>

                    <div className={styles.userDetails}>
                        <h2 className={styles.userName}>{name}</h2>
                        <p className={styles.role}>ATTENDEE</p>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.idInfo}>
                        <span className={styles.idLabel}>CREDENTIAL ID</span>
                        <span className={styles.idValue}>{customId}</span>
                    </div>
                    <div className={styles.qrWrapper}>
                        <img src={qrCodeDataUrl} alt="QR Code" className={styles.qrCode} />
                    </div>
                </div>

                <div className={styles.statusLine}>
                    <span>VERIFIED ATTENDEE</span>
                    <div className={styles.dot}></div>
                    <span>{eventName.split(' ')[0]} ACCESS GRANTED</span>
                </div>
            </div>
        </div>
    );
};

export default Badge;
