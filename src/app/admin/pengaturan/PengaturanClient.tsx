"use client"

import styles from "@/styles/admin.module.css"
import Link from "next/link"
import MaintenanceToggle from "@/components/MaintenanceToggle"
import Image from "next/image"

const IconSettings = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
const IconShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconArrowLeft = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const IconLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

export default function PengaturanClient({ settings }: { settings: any }) {
    return (
        <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
            
            {/* 1. TOP COMMAND BAR - DUAL PANE */}
            <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
                
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    marginBottom: '12px'
                }}>
                    <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Health • Global Configuration Hub</span>
                </div>

                <div className="headerWrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
                    <div className="titleWrapperMobile" style={{ flex: '1 1 400px' }}>
                        <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            Pengaturan Sistem
                        </h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                            Pusat kendali operasional global dan manajemen pemeliharaan infrastruktur.
                        </p>
                    </div>

                    <div className="statsContainer" style={{ display: 'flex', gap: '16px' }}>
                        <div className={`${styles.statPill} statPillMobile`} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}><IconActivity /></div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>OPERASIONAL</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Status Core</div>
                            </div>
                        </div>
                        
                        <div className={`${styles.statPill} statPillMobile`} style={{ 
                            background: settings.maintenance ? '#fef2f2' : 'white', 
                            border: `1px solid ${settings.maintenance ? '#fecaca' : '#e2e8f0'}`, 
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
                        }}>
                            <div className={styles.statIcon} style={{ background: settings.maintenance ? '#fee2e2' : '#f8fafc', color: settings.maintenance ? '#ef4444' : '#64748b' }}>
                                <IconLock />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: settings.maintenance ? '#dc2626' : '#0f172a' }}>{settings.maintenance ? 'TERKUNCI' : 'PUBLIK'}</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Akses Staf</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CONFIGURATION CARDS */}
            <div className="contentPaddingMobile" style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
                <div style={{ display: 'grid', gap: '24px', maxWidth: '900px' }}>
                    
                    {/* ENHANCED MAINTENANCE SECTION */}
                    <div className={`${styles.card} cardMobile`} style={{ 
                        borderRadius: '28px', 
                        padding: '32px', 
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <div className="cardHeaderRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                            <div className="maintenanceInfo" style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ background: '#fef2f2', color: '#ef4444', height: '42px', width: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconShield />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Mode Maintenance Global</h3>
                                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: settings.maintenance ? '#ef4444' : '#10b981', textTransform: 'uppercase' }}>
                                            Saat ini: {settings.maintenance ? 'Sistem Terkunci' : 'Berjalan Normal'}
                                        </p>
                                    </div>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6', margin: 0 }}>
                                    Aktifkan mode ini untuk menutup gerbang akses seluruh karyawan saat pemeliharaan database atau update infrastruktur. <span style={{ color: '#0f172a', fontWeight: 800 }}>Admin tetap memiliki akses penuh ke panel kontrol.</span>
                                </p>
                            </div>

                            <MaintenanceToggle 
                                initialValue={settings.maintenance} 
                                initialReason={settings.maintenanceReason || ""}
                                initialUntil={settings.maintenanceUntil || ""}
                            />
                        </div>

                        {/* DESCRIPTIVE INFO PANEL */}
                        <div className="infoPanelMobile" style={{
                            background: '#f8fafc',
                            borderRadius: '18px',
                            padding: '20px',
                            border: '1px dashed #cbd5e1',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center'
                        }}>
                            <div style={{ color: '#64748b' }}><IconSettings /></div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', fontWeight: 600, lineHeight: '1.5' }}>
                                Perubahan pada status maintenance memiliki dampak instan di seluruh perangkat (Mobile PWA & Desktop Dashboard). Disarankan untuk menyiarkan pemberitahuan resmi melalui Broadcast Hub sebelum melakukan penguncian sistem.
                            </p>
                        </div>
                    </div>

                    {/* ADDITIONAL SYSTEM INFO - METADATA */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '20px' 
                    }}>
                        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Versi Infrastruktur</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>V2.1.0-STABLE</div>
                        </div>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Lokasi Server</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Southeast-1 (ID)</div>
                        </div>
                    </div>

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
