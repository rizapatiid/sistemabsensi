"use client"

import styles from "@/styles/admin.module.css"
import Link from "next/link"
import MaintenanceToggle from "@/components/MaintenanceToggle"
import Image from "next/image"
import WhatsAppTester from "./WhatsAppTester"
import ServerMonitor from "./ServerMonitor"

const IconSettings = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
const IconShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconArrowLeft = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconInfo = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>

export default function PengaturanClient({ settings }: { settings: any }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* ── DARK HERO HEADER ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(20px, 5vw, 32px)',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
            }}>
                {/* Geometric accents */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

                <div className={styles.pengumumanHeaderFlex}>
                    <div className={styles.pengumumanHeaderLeft}>
                        <div className={styles.pengumumanHeaderIcon}>
                            <IconSettings />
                        </div>
                        <div>
                            <h1 className={styles.pengumumanHeaderTitle} style={{ color: 'white' }}>Pengaturan Sistem</h1>
                            <p className={styles.pengumumanHeaderDesc}>Pusat kendali operasional global dan manajemen pemeliharaan infrastruktur.</p>
                        </div>
                    </div>


                </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 2. CONFIGURATION CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(12px, 2vw, 16px)', width: '100%', marginBottom: '16px' }}>
                    {/* ENHANCED MAINTENANCE SECTION (BANNER STYLE) */}
                    <div style={{ 
                        background: settings.maintenance ? 'linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)' : 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '12px', 
                        padding: 'clamp(14px, 2vw, 18px) clamp(16px, 3vw, 22px)', 
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'clamp(12px, 2vw, 16px)',
                        flexWrap: 'nowrap',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 8px 20px -4px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 20px)', flex: 1, minWidth: 0 }}>
                            <div style={{ 
                                background: 'rgba(255, 255, 255, 0.4)', 
                                color: settings.maintenance ? '#e11d48' : '#059669', 
                                height: 'clamp(44px, 6vw, 52px)', 
                                width: 'clamp(44px, 6vw, 52px)', 
                                borderRadius: '50%', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.1)'
                            }}>
                                <svg width="clamp(22px, 3vw, 26px)" height="clamp(22px, 3vw, 26px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', justifyContent: 'center' }}>
                                <h3 style={{ 
                                    margin: '0', 
                                    fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
                                    fontWeight: 900, 
                                    color: settings.maintenance ? '#881337' : '#064e3b', 
                                    letterSpacing: '-0.01em',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1
                                }}>
                                    Maintenance Mode
                                </h3>
                                <p style={{ 
                                    margin: '0', 
                                    marginTop: '6px',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', 
                                    color: settings.maintenance ? '#be123c' : '#059669', 
                                    fontWeight: 600,
                                    lineHeight: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {settings.maintenance 
                                        ? 'Sistem sedang ditutup sementara.' 
                                        : 'Sistem sedang berjalan normal.'}
                                </p>
                            </div>
                        </div>

                        <MaintenanceToggle 
                            initialValue={settings.maintenance} 
                            initialReason={settings.maintenanceReason || ""}
                            initialUntil={settings.maintenanceUntil || ""}
                        />
                    </div>

                    {/* WHATSAPP API INTEGRATION MODULE */}
                    <WhatsAppTester />

                </div>

                {/* 3. SERVER MONITOR CARD (MOVED TO BOTTOM) */}
                <div style={{ width: '100%' }}>
                    <ServerMonitor />
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 768px) {
                    .headerWrapper {  
                        flex-direction: column !important; 
                        align-items: flex-start !important; 
                        gap: 16px !important; 
                        padding: 0 16px !important;
                        margin-bottom: 24px !important;
                    }
                    .titleWrapperMobile {
                        flex: unset !important;
                        width: 100% !important;
                    }
                    .statsContainer { 
                        width: 100% !important; 
                        flex-direction: column !important; 
                        gap: 12px !important; 
                    }
                    .statPillMobile { 
                        width: 100% !important; 
                        justify-content: flex-start !important; 
                        padding: 12px 16px !important;
                    }
                    .contentPaddingMobile {
                        padding: 0 16px 24px 16px !important;
                    }
                    .cardMobile {
                        padding: 20px !important;
                        border-radius: 20px !important;
                    }
                    .cardHeaderRow {
                        flex-direction: column !important;
                        align-items: center !important;
                        text-align: center !important;
                        gap: 16px !important;
                    }
                    .maintenanceInfo {
                        min-width: unset !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    .maintenanceInfo p {
                        text-align: center !important;
                    }
                    .infoPanelMobile {
                        flex-direction: column !important;
                        text-align: center !important;
                        gap: 12px !important;
                        padding: 16px !important;
                    }
                }
            `}</style>
        </div>
    )
}
