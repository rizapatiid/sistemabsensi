"use client"

import { useState, useTransition } from "react"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/transaksi_karyawan.module.css"

interface RekeningFormProps {
  initialBank: string
  initialNoRek: string
  initialNamaRek: string
}

// Minimalist SVGs
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)

export default function RekeningForm({ initialBank, initialNoRek, initialNamaRek }: RekeningFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showEdit, setShowEdit] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await updateRekeningAction(formData)
        if (res?.error) {
          setMessage({ type: "error", text: res.error })
        } else {
          setMessage({ type: "success", text: "Rekening berhasil diperbarui!" })
          setTimeout(() => {
            setShowEdit(false)
            setMessage(null)
          }, 1500)
        }
      } catch (err) {
        setMessage({ type: "error", text: "Terjadi kesalahan sistem." })
      }
    })
  }

  return (
    <div className={styles.rekeningContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '40px', flex: 1, flexWrap: 'wrap' }}>
          <div className={styles.inputGroup}>
            <label>NAMA BANK</label>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '900', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBank />
              {initialBank || "-"}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>NOMOR REKENING</label>
            <div style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0f172a', letterSpacing: '0.05em' }}>
              {initialNoRek ? initialNoRek.replace(/(\d{4})/g, '$1 ') : "-"}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>NAMA PEMILIK</label>
            <div style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0f172a' }}>{initialNamaRek || "-"}</div>
          </div>
        </div>
        <button onClick={() => setShowEdit(true)} className={styles.submitBtn} style={{ background: '#f8fafc', color: '#1a567e', border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconEdit />
          PERBARUI DATA
        </button>
      </div>

      {showEdit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999,
          padding: "20px",
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ 
            width: "100%", maxWidth: "420px", position: "relative", 
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(15,23,42,0.2)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Header Area */}
            <div style={{ 
              background: '#0f172a',
              padding: '32px 24px 24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button 
                onClick={() => { setShowEdit(false); setMessage(null); }} 
                style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", color: "#94a3b8", fontWeight: 'normal', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                ×
              </button>
              
              <div style={{ 
                width: '56px', height: '56px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 16px', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <line x1="6" y1="15" x2="10" y2="15" />
                  <line x1="14" y1="15" x2="18" y2="15" />
                </svg>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: "#ffffff", letterSpacing: '0.02em' }}>Pembaruan Rekening</h2>
              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "0.85rem", lineHeight: '1.5' }}>Sesuaikan dengan buku tabungan Anda.</p>
            </div>

            <div style={{ padding: '24px' }}>
              {message && (
                <div style={{ 
                  padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", textAlign: "center", fontWeight: "600",
                  backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: message.type === "success" ? "#166534" : "#991b1b",
                  border: `1px solid ${message.type === "success" ? "#dcfce7" : "#fee2e2"}`
                }}>
                  {message.text}
                </div>
              )}

              <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NAMA BANK</label>
                  <input type="text" name="rekeningBank" defaultValue={initialBank} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} placeholder="Contoh: BCA / MANDIRI" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NOMOR REKENING</label>
                  <input type="text" name="noRekening" defaultValue={initialNoRek} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', outline: 'none', letterSpacing: '0.05em' }} placeholder="000123456789" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NAMA PEMILIK</label>
                  <input type="text" name="namaRekening" defaultValue={initialNamaRek} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} placeholder="Sesuai Buku Tabungan" />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button type="button" onClick={() => setShowEdit(false)} style={{ flex: 1, padding: '14px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Batal
                  </button>
                  <button type="submit" disabled={isPending} style={{ flex: 2, padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: isPending ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                    {isPending ? "MEMPROSES..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
