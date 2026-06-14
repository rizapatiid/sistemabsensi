"use client"

import { useState } from "react"
import { sendTestWhatsAppAction } from "@/actions/admin"

export default function WhatsAppTester() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("Halo! Ini adalah pesan uji coba dari Sistem HRIS RMP Digitals.")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, msg: string}>({ type: null, msg: "" })

  const handleSend = async () => {
    if (!phone) {
      setStatus({ type: 'error', msg: "Nomor WhatsApp wajib diisi" })
      return
    }

    setLoading(true)
    setStatus({ type: null, msg: "" })
    
    try {
      const res = await sendTestWhatsAppAction(phone, message)
      if (res.error) {
        setStatus({ type: 'error', msg: res.error })
      } else {
        setStatus({ type: 'success', msg: "Pesan berhasil dikirim! Silakan cek WhatsApp Anda." })
        setPhone("")
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Terjadi kesalahan sistem saat mengirim." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
        background: 'white', 
        borderRadius: '28px', 
        padding: '32px', 
        border: '1px solid #e2e8f0',
        marginTop: '24px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#ecfdf5', color: '#10b981', height: '42px', width: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Integrasi WhatsApp API</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Modul Pengujian (Powered by Fonnte)
                </p>
            </div>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6', marginBottom: '24px' }}>
            Kirim pesan uji coba untuk memastikan API Fonnte terhubung dengan baik. Pastikan Anda sudah memasukkan <strong style={{color: '#0f172a'}}>FONNTE_TOKEN</strong> di file .env server.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Nomor Tujuan (Contoh: 08123456789)</label>
                <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Masukkan nomor WA..."
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Isi Pesan</label>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit'
                    }}
                />
            </div>
            
            <button 
                onClick={handleSend}
                disabled={loading}
                style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {loading ? 'Mengirim...' : 'Kirim Pesan Uji Coba'}
            </button>

            {status.msg && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: status.type === 'success' ? '#059669' : '#dc2626',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {status.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                    {status.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                    {status.msg}
                </div>
            )}
        </div>
    </div>
  )
}
