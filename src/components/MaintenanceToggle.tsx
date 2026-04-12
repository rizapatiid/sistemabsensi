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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}>
            
            {showForm && !isMaintenance && (
                <div style={{ 
                    background: '#f8fafc', 
                    padding: '20px', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'left',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Keterangan (Opsional)</label>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Contoh: Perbaikan modul payroll..."
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '10px', 
                            border: '1px solid #cbd5e1', 
                            fontSize: '0.85rem',
                            marginBottom: '16px',
                            minHeight: '80px',
                            fontFamily: 'inherit'
                        }}
                    />
                    
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Estimasi Selesai (Opsional)</label>
                    <input 
                        type="text"
                        value={until}
                        onChange={(e) => setUntil(e.target.value)}
                        placeholder="Contoh: Jam 14.00 WIB"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '10px', 
                            border: '1px solid #cbd5e1', 
                            fontSize: '0.85rem'
                        }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
                {showForm && (
                    <button 
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                        style={{
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        BATAL
                    </button>
                )}
                <button 
                    onClick={handleToggle}
                    disabled={loading}
                    style={{
                        background: isMaintenance ? '#ef4444' : (showForm ? '#0f172a' : '#3b82f6'),
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '14px',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.2s',
                        boxShadow: isMaintenance ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(59, 130, 246, 0.1)'
                    }}
                >
                    {loading ? 'MEMPROSES...' : isMaintenance ? 'MATIKAN MAINTENANCE' : (showForm ? 'AKTIFKAN SEKARANG' : 'SET MAINTENANCE')}
                </button>
            </div>
        </div>
    )
}
