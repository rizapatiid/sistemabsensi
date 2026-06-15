"use client"

import { useState } from "react"
import { updateMaintenanceAction } from "@/actions/settings"

export default function MaintenanceToggle({ 
    initialValue, 
    initialReason = "", 
    initialUntil = "" 
}: { 
    initialValue: boolean,
    initialReason?: string,
    initialUntil?: string
}) {
    const [isMaintenance, setIsMaintenance] = useState(initialValue)
    const [reason, setReason] = useState(initialReason)
    const [until, setUntil] = useState(initialUntil)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleToggle = async () => {
        if (!isMaintenance && !showForm) {
            setShowForm(true)
            return
        }

        const newValue = !isMaintenance
        setLoading(true)
        const res = await updateMaintenanceAction(newValue, newValue ? reason : "", newValue ? until : "")
        
        if (res.success) {
            setIsMaintenance(newValue)
            setShowForm(false)
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    return (
        <>
            <button 
                onClick={() => {
                    if (!isMaintenance) setShowForm(true)
                    else handleToggle()
                }}
                disabled={loading}
                style={{
                    background: isMaintenance ? '#ef4444' : '#0f172a',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    cursor: 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    boxShadow: isMaintenance ? '0 2px 4px rgba(239, 68, 68, 0.15)' : '0 2px 4px rgba(15, 23, 42, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                {loading ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                ) : isMaintenance ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                )}
                {loading ? 'Memproses...' : isMaintenance ? 'Matikan' : 'Aktifkan'}
            </button>

            {/* MODAL POPUP UNTUK AKTIFKAN MAINTENANCE */}
            {showForm && !isMaintenance && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px'
                }}>
                    <div style={{
                        background: '#ffffff',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '16px',
                        padding: '28px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.05)',
                        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        boxSizing: 'border-box'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '8px' }}>
                            <div style={{ 
                                width: '56px', height: '56px', background: '#fee2e2', color: '#ef4444', 
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Aktifkan Maintenance</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>Gembok sistem untuk perbaikan.<br/>Karyawan tidak akan bisa mengakses.</p>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f1f5f9', width: '100%' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    Pesan untuk Karyawan
                                </label>
                                <textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Contoh: Sedang dilakukan update server..."
                                    style={{ 
                                        width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc',
                                        fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box', color: '#0f172a',
                                        transition: 'all 0.2s', outline: 'none'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Otomatis Selesai Pada (Opsional)
                                </label>
                                <input 
                                    type="datetime-local"
                                    value={until}
                                    onChange={(e) => setUntil(e.target.value)}
                                    style={{ 
                                        width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc',
                                        fontSize: '0.85rem', boxSizing: 'border-box', color: '#0f172a', transition: 'all 0.2s', outline: 'none'
                                    }}
                                />
                                <p style={{ margin: '6px 0 0 4px', fontSize: '0.7rem', color: '#94a3b8' }}>*Kosongkan untuk mematikan mode secara manual.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <button 
                                onClick={() => setShowForm(false)}
                                disabled={loading}
                                style={{
                                    flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '10px',
                                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                Batalkan
                            </button>
                            <button 
                                onClick={handleToggle}
                                disabled={loading}
                                style={{
                                    flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '10px',
                                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                                }}
                            >
                                {loading ? 'Memproses...' : 'Kunci Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
