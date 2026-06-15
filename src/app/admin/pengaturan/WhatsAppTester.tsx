"use client"

import { useState } from "react"
import { sendTestWhatsAppAction } from "@/actions/admin"

export default function WhatsAppTester() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("Halo! Ini adalah pesan uji coba dari Sistem HRIS RMP Digitals.")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, msg: string}>({ type: null, msg: "" })

  const [showForm, setShowForm] = useState(false)

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
    <>
      <div style={{ 
          background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
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
                  background: 'rgba(255, 255, 255, 0.6)', 
                  color: '#128C7E', 
                  height: 'clamp(44px, 6vw, 52px)', 
                  width: 'clamp(44px, 6vw, 52px)', 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(18, 140, 126, 0.2)',
                  boxShadow: '0 4px 16px -4px rgba(18, 140, 126, 0.15)'
              }}>
                  <svg width="clamp(22px, 3vw, 26px)" height="clamp(22px, 3vw, 26px)" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', justifyContent: 'center' }}>
                  <h3 style={{ 
                      margin: '0', 
                      fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
                      fontWeight: 900, 
                      color: '#128C7E', 
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1
                  }}>
                      WhatsApp API
                  </h3>
                  <p style={{ 
                      margin: '0', 
                      marginTop: '6px',
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', 
                      color: '#128C7E', 
                      fontWeight: 600,
                      opacity: 0.85,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                  }}>
                      Sistem integrated by fonnte
                  </p>
              </div>
          </div>

          <button 
              onClick={() => setShowForm(true)}
              style={{
                  background: '#128C7E',
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px -2px rgba(18, 140, 126, 0.3)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transform: 'translateY(0)'
              }}
              onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(18, 140, 126, 0.4)'
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(18, 140, 126, 0.3)'
              }}
          >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Uji Coba
          </button>
      </div>

      {/* POPUP MODAL PENGUJIAN WA */}
      {showForm && (
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
                        width: '56px', height: '56px', background: '#ecfdf5', color: '#10b981', 
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Pengujian API Fonnte</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>Pastikan <strong>FONNTE_TOKEN</strong> di .env terisi.<br/>Kirim pesan tes ke nomor Anda.</p>
                    </div>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', width: '100%' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Nomor Tujuan
                        </label>
                        <input 
                            type="text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            style={{ 
                                width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc',
                                fontSize: '0.85rem', boxSizing: 'border-box', color: '#0f172a', transition: 'all 0.2s', outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Isi Pesan Uji Coba
                        </label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            style={{ 
                                width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc',
                                fontSize: '0.85rem', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box', color: '#0f172a',
                                transition: 'all 0.2s', outline: 'none', resize: 'none'
                            }}
                        />
                    </div>

                    {status.msg && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '10px',
                            background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                            color: status.type === 'success' ? '#059669' : '#dc2626',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {status.type === 'error' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                            {status.type === 'success' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                            {status.msg}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button 
                        onClick={() => { setShowForm(false); setStatus({type: null, msg: ""}); }}
                        disabled={loading}
                        style={{
                            flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '10px',
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Batalkan
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '10px',
                            fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                        }}
                    >
                        {loading ? 'Mengirim...' : 'Kirim Tes'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  )
}
